const messageModel = require("../models/messageModel");
const UserModel = require("../models/userModel");
const chatModel = require("../models/chatModel");

const allMessages = async (req, res) => {
  try {
    const messages = await messageModel
      .find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("reciever")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
// *************
// send Message
// **************

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.userid,
    content: content,
    chat: chatId,
  };

  try {
    var message = await messageModel.create(newMessage);

    console.log(message);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await message.populate("reciever");
    message = await UserModel.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    await chatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = { allMessages, sendMessage };
