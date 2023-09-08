import React, { useContext, useEffect, useState } from "react";
import "./myStyles.css";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../assets/live-chat.png";
import { IconButton } from "@mui/material";

// import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";

function Groups() {
  // const [refresh, setRefresh] = useState(true);
  const { refresh, setRefresh } = useContext(myContext);
  const token = localStorage.getItem("mykey");
  console.log("Data from LocalStorage : ", token);
  const [groups, SetGroups] = useState([]);

  const nav = useNavigate();
  if (!token) {
    console.log("User not Authenticated");
    navigate("/login");
    return; // Return early if user is not authenticated
  }

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get(
        "https://chat-app-backend-pv1s.onrender.com/chat/fetchGroups",
        config
      )
      .then((response) => {
        console.log("Group Data from API ", response.data);
        SetGroups(response.data);
      });
  }, [refresh]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          ease: "anticipate",
          duration: "0.3",
        }}
        className="list-container"
      >
        <div className="ug-header">
          <img
            src={logo}
            style={{ height: "2rem", width: "2rem", marginLeft: "10px" }}
          />
          <p className="ug-title">Available Groups</p>
          <IconButton
            className="icon"
            onClick={() => {
              setRefresh(!refresh);
            }}
          >
            <RefreshIcon />
          </IconButton>
        </div>
        <div className="sb-search">
          <IconButton className="icon">
            <SearchIcon />
          </IconButton>
          <input placeholder="Search" className="search-box" />
        </div>
        <div className="ug-list">
          {groups.map((group, index) => {
            return (
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="list-tem"
                key={index}
                onClick={() => {
                  console.log("Creating chat with group", group.name);
                  // const config = {
                  //   headers: {
                  //     Authorization: `Bearer ${userData.data.token}`,
                  //   },
                  // };
                  // axios.post(
                  //   "http://localhost:8080/chat/",
                  //   {
                  //     userId: user._id,
                  //   },
                  //   config
                  // );
                  // dispatch(refreshSidebarFun());
                }}
              >
                <p className="con-icon">{group.chatName[0]}</p>
                <p className="con-title">{group.chatName}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Groups;
