const express = require("express");
const app = express();
var cors = require("cors");

const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");

const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
app.use(cors());
dotenv.config();
app.use(express.json()); //important
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log("server started at port " + PORT);
    });
  })
  .catch((err) => {
    console.log("server is not connected to database ", err.message);
  });

app.get("/", (req, res) => {
  res.send("Api is running");
});
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);
