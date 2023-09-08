import { useState } from "react";
import "./App.css";
// import Login from "./Components/Login";
import MainContainer from "./Components/MainContainer";
import { Route, Routes } from "react-router-dom";
import Welcome from "./Components/Welcome";
import ChatArea from "./Components/ChatArea";
import Users_Groups from "./Components/Users_Groups";
import Groups from "./Components/Groups";
import CreateGroups from "./Components/CreateGroups";
import Signup from "./Components/Signup";
import Login from "./Components/Login";

function App() {
  return (
    <div className="App">
      {/* <MainContainer /> */}
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="app" element={<MainContainer />}>
          <Route path="welcome" element={<Welcome />} />
          <Route path="chat/:_id" element={<ChatArea />} />
          <Route path="groups" element={<Groups />} />
          <Route path="users" element={<Users_Groups />} />
          <Route path="create-groups" element={<CreateGroups />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
