const { getAllUsers, getUser, updateUser, deleteUser } = require("../controllers/userController");
const { registerUser, signIn, verifyToken, removeToken } = require("../controllers/authController");

module.exports = function (router) {
	router.post("/registerUser", registerUser);
	router.post("/signIn", signIn);
	router.get("/getUsersList", verifyToken, getAllUsers);
	router.get("/getUser/:userId", verifyToken, getUser);
	router.put("/updateUser/:userId", verifyToken, updateUser);
	router.delete("/removeUser/:userId", verifyToken, deleteUser);
	router.get("/signOut", removeToken);
};
