const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const userauth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      console.log(token);
      let verify = jwt.verify(token, SECRET_KEY);

      req.userid = verify.id;
      req.username = verify.uname;
      req.userEmail = verify.email;
    } else {
      console.log(token);
      res.status(401).json({ message: "token not available ......" });
    }
    next();
  } catch (error) {
    console.log(error.message);
    console.log(token);
    res.status(401).json({ message: "false token....." });
  }
};

module.exports = userauth;
