const User = require("../models/userModel");
const { hashSync, compareSync } = require("bcryptjs");
const { v4 } = require("uuid");
const { createToken, saveToken, getToken, deleteToken } = require("../helpers/tokenHelper");

/*
	* Create, verify and save new user 
	* @param {Object} req: express request object
	* @param {Object} res: express result object
*/

exports.registerUser = function (req, res) {
	// Validate request
	if (!req.body.email) {
		return res.status(400).send({
			message: "Email Id can not be empty",
		});
	} else if (!req.body.name) {
		return res.status(400).send({
			message: "Name can not be empty",
		});
	} else if (!req.body.password) {
		return res.status(400).send({
			message: "Password can not be empty",
		});
	}

	//check for duplicate email
	User.findOne({
		email: req.body.email,
	})
		.then((User) => {
			if (User) {
				return res.status(404).send({
					message:
						"Failed! EmailId is already in use - " + req.body.email,
				});
			}
		})
		.catch((err) => {
			return res.status(500).send({ message: err });
		});

	// Create a User
	const addUser = new User({
		email: req.body.email,
		name: req.body.name,
		description: req.body.description ? req.body.description : null,
		password: hashSync(req.body.password, 8),
		userId: v4(),
	});

	// Save User in the database
	addUser
		.save()
		.then((data) => {
			return res.send(data);
		})
		.catch((err) => {
			return res.status(500).send({
				message:
					err.message ||
					"Some error occurred while creating the User.",
			});
		});
}

/*
	* SignIn user 
	* @param {Object} req: express request object
	* @param {Object} res: express result object
*/

exports.signIn = function (req, res) {
	User.findOne({
		email: req.body.email,
	})
		.then((User) => {
			if (!User) {
				return res.status(404).send({
					message: "Email Id not found ",
				});
			}

			const passwordIsValid = compareSync(
				req.body.password,
				User.password
			);

			if (!passwordIsValid) {
				return res.status(401).send({
					accessToken: null,
					message: "Invalid Password!",
				});
			}

			createToken((err, token) => {
				if (err) {
					return res.status(500).send({
						message: err.message
					});
				} else {
					saveToken(token, User, (err) => {
						if (err) {
							return res.status(500).send({
								message: err.message
							});
						} else {
							res.status(200).send({
								userId: User.userId,
								email: User.email,
								name: User.name,
								accessToken: token
							});
						}
					});
				}
			});
		})
		.catch((err) => {
			return res.status(500).send({
				message: err.message || "Error retrieving email id"
			});
		});
}



/*
	* Middleware to verify the token and store the user data in req.userId
	* @param {Object} req: express request object
	* @param {Object} res: express result object
	* @param {Function} next: express next function 
*/

exports.verifyToken = function (req, res, next) {
	let token = req.headers["x-access-token"];
	if (!token) {
		return res.status(401).send({ message: "Unauthorized!" });
	}
	getToken(token, (err, userData) => {
		if (err) {
			return res.status(500).send({
				message: err.message
			});
		} else {
			req.userId = userData.userId;
			next();
		}
	});
}

/*
	* SignOut user 
	* @param {Object} req: express request object
	* @param {Object} res: express result object
*/

exports.removeToken = function (req, res) {
	let token = req.headers["x-access-token"];
	if (!token) {
		return res.status(401).send({ message: "Unauthorized!" });
	}
	deleteToken(token, (err) => {
		if (err) {
			return res.status(500).send({
				message: err.message
			});
		} else {
			res.status(200).send({
				message: "User signOut succcessfully"
			});
		}
	});
}
