import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/live-chat.png";

import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Alert, AlertTitle } from "@mui/material";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate(); //initialize the useRouter hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/user/login",
        formData
      );
      console.log(response.data);
      if (response.status == 201) {
        // Assuming the token is returned in the response data as 'token'
        const token = response.data.token;
        const username = response.data.user.name;
        console.log(username);

        // Store the token in the local storage
        localStorage.setItem("mykey", token);
        navigate("/app/welcome", { state: { username } });
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="login-container">
      <div className="image-container">
        <img src={logo} alt="Logo" className="welcome-logo" />
      </div>

      <div className="login-box">
        <p className="login-text">Login To Continue</p>

        <TextField
          id="outlined-email-input"
          label="Email"
          value={formData.email}
          type="email"
          name="email"
          variant="outlined"
          onChange={handleChange}
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          value={formData.password}
          type="password"
          name="password"
          autoComplete="current-password"
          variant="outlined"
          onChange={handleChange}
        />
        <Button variant="outlined" onClick={handleSubmit}>
          LOGIN
        </Button>
        <Link to="/">
          <p>Don't Have Account , SIGN UP!</p>
        </Link>
      </div>
    </div>
  );
}

export default Login;
