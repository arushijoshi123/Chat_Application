const express = require("express");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/userModel");
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
// **************************
//login  functionality;
// ***************************

const login = async (req, res) => {
  const { email, password } = req.body;
  // Check for all fields
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are necessary" });
  }

  try {
    const existingUser = await UserModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    //verifying password
    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // token generation after successfull login
    const token = jwt.sign(
      {
        uname: existingUser.name,
        email: existingUser.email,
        id: existingUser._id,
      },
      SECRET_KEY
    );

    res.status(201).json({
      user: existingUser,
      token: token,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong with signing user" });
  }
};
// **************************
//sign up functionality
// ***************************

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Check for all fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are necessary" });
  }

  try {
    // Preexisting user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists!");
    }

    // Username already taken
    const existingUsername = await UserModel.findOne({ name });
    if (existingUsername) {
      return res.status(400).send("Choose a different username!");
    }
    //hashed password
    const hashPassword = await bcrypt.hash(password, 10);
    // Creating entry for new user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashPassword,
    });

    return res
      .status(201)
      .json({ user: newUser })
      .send("User created successfully");
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// ***************************
// fetchAllUsers functionality
// ***************************
const fetchAllUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.serach, $options: "i" } },
            { email: { $regex: req.query.serach, $options: "i" } },
          ],
        }
      : {};

    const users = await UserModel.find({
      ...keyword,
      _id: { $ne: req.userid },
    });

    res.send(users);
  } catch (error) {
    // Handle the error gracefully
    console.error("Error fetching users:", error);
    res.status(500).send("An error occurred while fetching users.");
  }
};

module.exports = { signup, login, fetchAllUsers };
