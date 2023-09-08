const express = require("express");
const messageController = require("../Controllers/messageController");
const userauth = require("../middleware/auth");
const messageRouter = express.Router();

// **** Protected Routes ****
messageRouter.get("/:chatId", userauth, messageController.allMessages);
messageRouter.post("/", userauth, messageController.sendMessage);

module.exports = messageRouter;
