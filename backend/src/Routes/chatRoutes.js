const express = require("express");
const chatController = require("../Controllers/chatController");
const userauth = require("../middleware/auth");
const chatRouter = express.Router();
// **** Protected Routes ****
chatRouter.post("/", userauth, chatController.accessChat);
chatRouter.get("/", userauth, chatController.fetchChats);
chatRouter.post("/createGroup", userauth, chatController.createGroupChat);
chatRouter.get("/fetchGroups", userauth, chatController.fetchGroups);
module.exports = chatRouter;
