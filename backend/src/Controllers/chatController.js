const express = require("express");
const UserModel = require("../models/userModel");
const chatModel = require("../models/chatModel");
const SECRET_KEY = process.env.SECRET_KEY;

// **************************
// user chatAccess   functionality;
// ***************************

const accessChat = async (req, res) => {
  const { userId, isGroupChat, groupId } = req.body;
  console.log(userId);

  if (!userId) {
    console.log("UserId param not sent with request");
    return res
      .status(400)
      .json({ message: "userID param not sent with request" });
  }

  try {
    if (isGroupChat) {
      // Handle group chat
      if (!groupId) {
        console.log("Group ID not sent with request");
        return res
          .status(400)
          .json({ message: "GroupID param not sent with request" });
      }

      // Fetch or create the group chat based on the provided groupId
      const groupChat = await chatModel
        .findOne({ _id: groupId })
        .populate("users", "-password")
        .exec();

      if (groupChat) {
        res.json(groupChat);
      } else {
        console.log("Group chat not found");
        res.status(404).json({ message: "Group chat not found" });
      }
    } else {
      // Handle one-on-one chat
      const isChat = await chatModel
        .find({
          isGroupChat: false,
          users: { $all: [req.userid, userId] },
        })
        .populate("users", "-password")
        .populate("latestMessage")
        .populate("latestMessage.sender", "name email")
        .exec();

      if (isChat.length > 0) {
        res.json(isChat[0]);
      } else {
        const chatData = {
          chatName: "sender",
          isGroupChat: false,
          users: [req.userid, userId],
        };
        const createdChat = await chatModel.create(chatData);
        const FullChat = await chatModel
          .findOne({ _id: createdChat._id })
          .populate("users", "-password")
          .exec();

        res.status(200).json(FullChat);
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// *******************
// Fetch chats
// *******************
const fetchChats = async (req, res) => {
  try {
    console.log("Fetch Chats aPI : ", req);
    chatModel
      .find({ users: { $elemMatch: { $eq: req.userid } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await UserModel.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// *************************
// Creating Group Chat
// *************************

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Data is insufficient" });
  }
  // if (!req.user) {
  //   return res.status(401).send({ message: "User not authenticated" });
  // }
  var users = req.body.users;

  console.log("chatController/createGroups : ", req);
  console.log("this is  the list of users before input", users);
  users.push(req.user);

  try {
    const groupChat = await chatModel.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await chatModel
      .findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// ********************************
// Fetch Groups
// ********************************

const fetchGroups = async (req, res) => {
  try {
    const allGroups = await chatModel.where("isGroupChat").equals(true);
    res.status(200).send(allGroups);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = { accessChat, fetchChats, createGroupChat, fetchGroups };
