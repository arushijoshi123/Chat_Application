import React, { useState, useEffect, useContext } from "react";
import jwt_decode from "jwt-decode";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LightModeIcon from "@mui/icons-material/LightMode";
import "./myStyles.css";
import { IconButton } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { myContext } from "./MainContainer";

function Sidebar() {
  const { refresh, setRefresh } = useContext(myContext);
  const [lightTheme, setLightTheme] = useState(true);
  const [searchContent, setSearchContent] = useState("");
  const [conversations, setConversations] = useState([]);
  const token = localStorage.getItem("mykey");
  const navigate = useNavigate();

  useEffect(() => {
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.id;

    if (!token) {
      console.log("User not Authenticated");
      navigate("/login");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        params: {
          search: "",
        },
      },
    };

    axios.get("http://localhost:5000/chat/", config).then((response) => {
      console.log("Data refreshed in sidebar ", response.data);
      setConversations(response.data);
    });
  }, [refresh, token, navigate]);

  return (
    <div className="sidebar-container">
      <div className="sb-header">
        <div>
          <IconButton>
            <AccountCircleRoundedIcon className="icon" />
          </IconButton>
        </div>
        <div>
          <IconButton onClick={() => navigate("users")}>
            <PersonAddAlt1RoundedIcon className="icon" />
          </IconButton>
          <IconButton onClick={() => navigate("groups")}>
            <GroupAddRoundedIcon className="icon" />
          </IconButton>
          <IconButton onClick={() => navigate("create-groups")}>
            <AddCircleRoundedIcon className="icon" />
          </IconButton>
        </div>
      </div>

      <div className="sb-search">
        <IconButton>
          <SearchOutlinedIcon className="icon" />
        </IconButton>
        <input placeholder="Search" className="search-box" />
      </div>
      <div className="sb-conversations">
        {conversations.map((conversation, index) => {
          const decodedToken = jwt_decode(token);
          const userId = decodedToken.id;
          const otherUser = conversation.users.find(
            (user) => user._id !== userId
          );
          const otherUserName = otherUser ? otherUser.name : "Unknown User";

          if (conversation.users.length === 1) {
            return <div key={index}></div>;
          }

          return (
            <div
              key={index}
              className="conversation-container"
              onClick={() => {
                navigate("chat/" + conversation._id + "&" + otherUserName);
              }}
            >
              <p className="con-icon">{otherUserName[0]}</p>
              <p className="con-title">{otherUserName}</p>
              <p className="con-lastMessage">
                {conversation.latestMessage
                  ? conversation.latestMessage.content
                  : "No previous Messages, click here to start a new chat"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
