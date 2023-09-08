import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

function CreateGroups() {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]); // State to store selected users
  const [open, setOpen] = useState(false);
  const [usersList, setUsersList] = useState([]); // State to store the list of users

  const token = localStorage.getItem("mykey");
  console.log("Data from LocalStorage: ", token);
  const decodedToken = jwt_decode(token);
  console.log(decodedToken);
  const userId = decodedToken.id;
  const nav = useNavigate();

  useEffect(() => {
    // Fetch the list of users (excluding the logged-in user) from the server
    if (!token) {
      console.log("User not Authenticated");
      navigate("/login");
      return; // Return early if user is not authenticated
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get("http://localhost:5000/user/fetchUsers", config)
      .then((response) => {
        console.log(" UData refreshed in Users panel ");
        setUsersList(response.data);
      });
  }, [token]); // Pass an empty dependency array to run the effect only once on mount

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createGroup = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(
        "https://chat-app-backend-pv1s.onrender.com/chat/createGroup",
        {
          name: groupName,
          admin: token, // Logged-in user as admin
          users: [...selectedUsers, userId], // Include selected users and the logged-in user
        },
        config
      )
      .then((response) => {
        // nav("/app/groups");
        console.log("created group !!!!!!!!!");
        console.log(response);
      })
      .catch((error) => {
        console.error("Error creating group:", error);
      });
  };

  return (
    <>
      <div className="group">
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Do you want to create a Group Named " + groupName}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will create a group in which you will be the admin, and other
              users will be able to join this group.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button
              onClick={() => {
                createGroup();
                handleClose();
              }}
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>

        <div className="createGroups-container">
          <input
            placeholder="Enter Group Name"
            className="search-box"
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
          />
        </div>
        <div className="creategrp">
          <div className="top">
            <div className="head">
              <h3>Select users to add to the group:</h3>
            </div>
            <div className="icon">
              <IconButton
                onClick={() => {
                  handleClickOpen();
                }}
              >
                <DoneOutlineRoundedIcon />
              </IconButton>
            </div>
          </div>

          <div className="list">
            <ul>
              {usersList.map((user) => (
                <li key={user._id}>
                  <label>
                    <input
                      type="checkbox"
                      value={user._id}
                      onChange={(e) => {
                        const userId = e.target.value;
                        setSelectedUsers((prevSelectedUsers) => {
                          if (prevSelectedUsers.includes(userId)) {
                            return prevSelectedUsers.filter(
                              (selectedId) => selectedId !== userId
                            );
                          } else {
                            return [...prevSelectedUsers, userId];
                          }
                        });
                      }}
                    />
                    {user.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateGroups;
