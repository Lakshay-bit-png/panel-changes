import React, { useEffect } from "react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";

export const NewAdmin = () => {
  const displayName = sessionStorage.getItem("username");
  const displayRole = sessionStorage.getItem("role");
  const accessToken = sessionStorage.getItem("accessToken");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [ref, setRef] = useState("");

  useEffect(() => {
    const displayRole = sessionStorage.getItem('role');
    if(!displayRole){
      redirectTOSignin();
    }
  },[]);
  const handleInputChange2 = (event) => {
    setUserId(event.target.value);
  };
  const handleInputChange3 = (event) => {
    setUserName(event.target.value);
  };
  const handleInputChange4 = (event) => {
    setUserPassword(event.target.value);
  };
  const handleInputChange5 = (event) => {
    setRef(event.target.value);
  };
  const NavigationHistory = useNavigate();
  const redirectToAdminPage = () => {
    NavigationHistory("/admin");
  };
  const redirectTOSignin = () => {
    NavigationHistory('/');
  };
  const handlePostRequest = async () => {
    if (displayRole === "Owner") {
    await fetch("http://localhost:5001/api/auth/createAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          username: userId,
          password: userPassword,
          role: "Admin",
          description: ref
        }),
      });
    }
  };

  const handleSubmit = async () => {
    if (displayRole === "Owner") {
      await handlePostRequest();
      redirectToAdminPage();
    }
  };

  if (displayRole === "Owner") {
    return (
      <div className="macbook-pro">
        <Sidebar />
        <div className="mainScreen2">
          <div>
            <h1 className="heading">Add New Admin</h1>
          </div>
          <div className="input1">
            UserId:{" "}
            <input
              type="text"
              className="textbox"
              name="userid"
              onChange={handleInputChange2}
              value={userId}
            />
          </div>
          <div className="input2">
            UserName:{" "}
            <input
              type="text"
              className="textbox"
              name="userid"
              onChange={handleInputChange3}
              value={userName}
            />
          </div>
          <div className="input3">
            Password:{" "}
            <input
              type="text"
              className="textbox"
              name="userid"
              onChange={handleInputChange4}
              value={userPassword}
            />
          </div>
          <div className="input3">
            Referral : {" "}
            <input
              type="text"
              className="textbox"
              name="userid"
              onChange={handleInputChange5}
              value={ref}
            />
          </div>
          <button className="button-1" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="home">
        <div className="sidebar">
          <div className="userimg"></div>
          <div className="ownername">{displayName}</div>
          <div className="displayRole" style={{ color: "white" }}>
            {displayRole}
          </div>
          <div className="title">
            <a href="/" className="link">
              Log Out
            </a>
          </div>
        </div>
        <div className="mainScreen">
          <h1>
            This Screen is only for Owner.<br></br> Kindly Login Again.
          </h1>
        </div>
      </div>
    );
  }
};

export default NewAdmin;
