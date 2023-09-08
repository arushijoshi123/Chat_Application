import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import jwt_decode from "jwt-decode";
import SendIcon from "@mui/icons-material/Send";
import React, { useState, useContext, useEffect, useRef } from "react";
import MessageOthers from "./MessageOthers";
import MessageSelf from "./MessageSelf";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { myContext } from "./MainContainer";
function ChatArea() {
  const [messageContent, setMessageContent] = useState("");
  const dyParams = useParams();
  const messagesEndRef = useRef(null);
  const [chat_id, chat_user] = dyParams._id.split("&");
  const token = localStorage.getItem("mykey");

  console.log("Data from LocalStorage : ", token);
  const decodedToken = jwt_decode(token);
  console.log(decodedToken);
  const userId = decodedToken.id;
  console.log(userId);
  const [allMessages, setAllMessages] = useState([]);
  const [loaded, setloaded] = useState(false);
  const { refresh, setRefresh } = useContext(myContext);

  const sendMessage = () => {
    // console.log("SendMessage Fired to", chat_id._id);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .post(
        "http://localhost:5000/message/",
        {
          content: messageContent,
          chatId: chat_id,
        },
        config
      )
      .then(({ data }) => {
        console.log("Message Fired");
      });
  };
  useEffect(() => {
    console.log("Users refreshed");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get("http://localhost:5000/message/" + chat_id, config)
      .then(({ data }) => {
        setAllMessages(data);
        setloaded(true);
        // console.log("Data from Acess Chat API ", data);
      });
    // scrollToBottom();
  }, [refresh, chat_id, token]);

  if (!loaded) {
    return (
      <div
        style={{
          border: "20px",
          padding: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            borderRadius: "10px",
            flexGrow: "1",
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
      </div>
    );
  } else {
    return (
      <div className="chatArea-container">
        <div className="chatArea-header">
          <p className="con-icon">{chat_user[0]}</p>
          <div className="header-text">
            <p className="con-title">{chat_user}</p>
          </div>
          <IconButton className="icon">
            <DeleteIcon />
          </IconButton>
        </div>
        <div className="messages-container">
          {allMessages
            .slice(0)
            .reverse()
            .map((message, index) => {
              const sender = message.sender;
              const self_id = userId;
              // console.log(self_id);
              if (sender._id === self_id) {
                // console.log("I sent it ");
                return <MessageSelf props={message} key={index} />;
              } else {
                // console.log("Someone Sent it");
                return <MessageOthers props={message} key={index} />;
              }
            })}
        </div>
        <div ref={messagesEndRef} className="BOTTOM" />
        <div className="text-input-area">
          <input
            placeholder="Type a Message"
            className="search-box"
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
            }}
            onKeyDown={(event) => {
              if (event.code == "Enter") {
                // console.log(event);
                sendMessage();
                setMessageContent("");
                setRefresh(!refresh);
              }
            }}
          />
          <IconButton
            className="icon"
            onClick={() => {
              sendMessage();
              setRefresh(!refresh);
              setMessageContent("");
            }}
          >
            <SendIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default ChatArea;
