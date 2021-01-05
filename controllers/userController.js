const User = require("../models/userModel");

/*
    * Get all users list 
    * @param {Object} req: express request object
    * @param {Object} res: express result object
*/

exports.getAllUsers = (req, res) => {
    User.find()
        .then((Users) => {
            res.send(Users);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while retrieving Users.",
            });
        });
};

/*
    * Get userId specific user details 
    * @param {Object} req: express request object
    * @param {Object} res: express result object
*/

exports.getUser = (req, res) => {
    User.findOne({
        userId: req.params.userId,
    })
        .then((User) => {
            if (!User) {
                return res.status(404).send({
                    message: "User not found",
                });
            }
            res.send(User);
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message || "Error retrieving user details",
            });
        });
};

/*
    * Update user details by UserId
    * @param {Object} req: express request object
    * @param {Object} res: express result object
*/

exports.updateUser = (req, res) => {
    // Validate Request
    if (!req.params.userId) {
        return res.status(400).send({
            message: "userId required",
        });
    }

    // Find User and update it with the request body
    User.findOneAndUpdate(
        {
            userId: req.params.userId,
        },
        {
            name: req.body.name,
            description: req.body.description ? req.body.description : null,
        },
        { useFindAndModify: false }
    )
        .then((User) => {
            if (!User) {
                return res.status(404).send({
                    message: "User not found !",
                });
            }
            res.send({ success: true, message: "Record updated successfully" });
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message || "Error updating user details",
            });
        });
};

/*
    * Delete user details by UserId
    * @param {Object} req: express request object
    * @param {Object} res: express result object
*/

exports.deleteUser = (req, res) => {
    User.findOneAndRemove({
        userId: req.params.userId,
    })
        .then((User) => {
            if (!User) {
                return res.status(404).send({
                    message: "User not found !",
                });
            }
            return res.send({
                success: true,
                message: "User deleted successfully",
            });
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message || "Could not delete user",
            });
        });
};
