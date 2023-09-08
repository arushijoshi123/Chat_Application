import React, { useContext, useEffect, useState } from "react";

import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import logo from "../assets/live-chat.png";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { myContext } from "./MainContainer";

function Users_Groups() {
  const [users, setUsers] = useState([]);
  const { refresh, setRefresh } = useContext(myContext);
  const token = localStorage.getItem("mykey");
  console.log("Data from LocalStorage : ", token);
  // const decodedToken = jwt_decode(token);
  // const userId = decodedToken.userId;

  const navigate = useNavigate();

  useEffect(() => {
    // const userData = JSON.parse(localStorage.getItem("mykey"));

    if (!token) {
      console.log("User not Authenticated");
      navigate("/login");
      return; // Return early if user is not authenticated
    }

    console.log("Users refreshed");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        params: {
          search: "", // Add search query if needed
        },
      },
    };
    axios
      .get("https://chat-app-backend-pv1s.onrender.com/user/fetchUsers", config)
      .then((response) => {
        console.log(" UData refreshed in Users panel ");
        setUsers(response.data);
      });
  }, [refresh]); // Pass an empty dependency array to run the effect only once on mount

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          duration: "0.3",
        }}
        className="list-container"
      >
        <div className="ug-header">
          <img src={logo} style={{ height: "2rem", width: "2rem" }} />
          <p className="ug-title">Online Users</p>
          <IconButton
            className={"icon"}
            onClick={() => {
              setRefresh(!refresh);
            }}
          >
            <RefreshIcon />
          </IconButton>
        </div>

        <div className="sb-search">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <input placeholder="Search" className="search-box" />
        </div>
        <div className="ug-list">
          {users.map((user, index) => {
            return (
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={"list-tem"}
                key={index}
                onClick={() => {
                  console.log("Creating chat with ", user.name);
                  const config = {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  };
                  axios
                    .post(
                      "https://chat-app-backend-pv1s.onrender.com/chat/",
                      {
                        userId: user._id,
                      },
                      config
                    )
                    .then(() => {
                      console.log("Chat created successfully");
                      // Dispatch refreshSidebarFun() here if needed
                    })
                    .catch((error) => {
                      console.error("Error creating chat:", error);
                    });
                }}
              >
                <div className="conversation-container">
                  <p className={"con-icon"}>{user.name[0]}</p>
                  <p className={"con-title"}>{user.name}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Users_Groups;
