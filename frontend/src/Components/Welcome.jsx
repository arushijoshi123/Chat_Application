import React from "react";
import logo from "../assets/live-chat.png";
import { useLocation } from "react-router-dom";

function Welcome() {
  const location = useLocation();
  const { username } = location.state;
  console.log(location.state);

  return (
    <div className="welcome-container">
      <img src={logo} alt="Logo" className="welcome-logo" />
      <h1>Hiii {username}!</h1>
      <p>Texting is fun !!!!!!!! </p>
    </div>
  );
}

export default Welcome;
