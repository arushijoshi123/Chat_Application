import React from "react";
import "./myStyles.css";
// import { useDispatch, useSelector } from "react-redux";

function MessageOthers({ props }) {
  // const dispatch = useDispatch();
  // const lightTheme = useSelector((state) => state.themeKey);

  return (
    <div className="other-message-container">
      <div className="conversation-container">
        <p className="con-icon">{props.sender.name[0]}</p>
        <div className="other-text-content">
          <p className="con-title">{props.sender.name}</p>
          <p className="con-lastMessage">{props.content}</p>
        </div>
      </div>
    </div>
  );
}

export default MessageOthers;
