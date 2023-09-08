import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/live-chat.png";

import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Alert, AlertTitle } from "@mui/material";
const apiurl = import.meta.env.VITE_API_URL;
function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page

    if (!name || !email || !password) {
      //   toast.error("Please fill in all the fields.");
      <Alert severity="warning">
        All Fields are Necessary — check it out!
      </Alert>; //shows msg in red
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/user/signup", {
        name,
        email,
        password,
      });

      console.log(response.data); // Handle the response from the server

      if (response.status === 201) {
        // toast.success("Registered successfully !!!");
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          User Registered successfully!!! — <strong>check it out!</strong>
        </Alert>; //shows message in green
        navigate("/login");
      } else {
        // toast.error(response.data.message);
        <Alert severity="error">(response.data.message)— check it out!</Alert>;
      }
    } catch (error) {
      console.error(error);
      //   toast.error("An error occurred. Please try again.");
      <Alert severity="error">An error occurred - Please try again—!</Alert>;
    }
  };
  return (
    <div className="login-container">
      <div className="image-container">
        <img src={logo} alt="Logo" className="welcome-logo" />
      </div>

      <div className="login-box">
        <p className="login-text">Sign Up To Use ChatAPP</p>
        <TextField
          id="outlined-basic"
          label="Enter Username"
          value={name}
          variant="outlined"
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          id="outlined-email-input"
          label="Email"
          value={email}
          type="email"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          value={password}
          type="password"
          autoComplete="current-password"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="outlined" onClick={handleSubmit}>
          SIGNUP
        </Button>
        <Link to="/login">
          <p>Already a user , LOGIN!</p>
        </Link>
      </div>
    </div>
  );
}

export default Signup;
