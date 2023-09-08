const express = require("express");
const userController = require("../Controllers/userController");
const userauth = require("../middleware/auth");
const userRouter = express.Router();
userRouter.post("/login", userController.login);
userRouter.post("/signup", userController.signup);

// **** Protected Routes ****
userRouter.get("/fetchUsers", userauth, userController.fetchAllUsers);
module.exports = userRouter;
