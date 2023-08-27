import React from "react";
import Sidebar from "../Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AppInfo() {
  const displayName = sessionStorage.getItem("username");
  const displayRole = sessionStorage.getItem("role");
  const accessToken = sessionStorage.getItem("accessToken");
  const [roomId, setRoomId] = useState("");
  const [description, setDescription] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const displayRole = sessionStorage.getItem("role");
    if (!displayRole) {
      redirectTOSignin();
    }
  }, []);

  const NavigationHistory = useNavigate();
  const redirectTOSignin = () => {
    NavigationHistory("/");
  };
  const redirectToAdminPage = () => {
    NavigationHistory("/allUsers");
  };
  const handleInputChange = (event) => {
    setRoomId(event.target.value);
  };
  const handleInputChange2 = (event) => {
    setDescription(event.target.value);
  };
  const handleInputChange3 = (event) => {
    setOldPassword(event.target.value);
  };
  const handleInputChange4 = (event) => {
    setNewPassword(event.target.value);
  };
  const handleSocket = async () => {
    if (displayRole === "Admin") {
      await fetch(`http://13.233.17.176:5001/api/admin/announcement/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          announcement: description,
        }),
      });
      console.log("announcement sent");
    }
  };
  const handleChangePassword = async () => {
    if (displayRole === "Admin") {
      await fetch(`http://13.233.17.176:5001/api/admin/changePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: displayName,
          password: oldPassword,
          newPassword: newPassword,
        }),
      });
      console.log("password changed");
      redirectToAdminPage();
    }
  };
  const handleSubmit = async () => {
    if (displayRole === "Admin") {
      await handleSocket();
      redirectToAdminPage();
      console.log("announcement sent");
    }
  };

  return (
    <>
      <Sidebar />
      <div className="main-content-5">
        <div className="main-header-5">Announcement </div>
        <form className="user-details-form">
          <div className="align-inputs">
            <div className="i1">
              <label htmlFor="user-id">RoomId:</label>
              <input id="user-id" value={roomId} onChange={handleInputChange} />
            </div>
            <div className="i5">
              <label htmlFor="message">Message:</label>
              <input
                id="message"
                value={description}
                onChange={handleInputChange2}
              />
            </div>
          </div>
          <div className="save-btn">
            <button
              className="btn-save"
              style={{ margintop: "30px" }}
              onClick={handleSubmit}
            >
              Send
            </button>
          </div>
        </form>
        <div className="main-header-5">Change Password </div>
        <form className="user-details-form">
          <div className="align-inputs">
            <div className="i2">
              <label htmlFor="password">Current Password:</label>
              <input
                id="password"
                value={oldPassword}
                onChange={handleInputChange3}
              />
            </div>
            <div className="i5">
              <label htmlFor="message">New Password :</label>
              <input
                id="message"
                value={newPassword}
                onChange={handleInputChange4}
              />
            </div>
          </div>
          <div className="save-btn">
            <button
              className="btn-save"
              style={{ margintop: "30px" }}
              onClick={handleChangePassword}
            >
              Change
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AppInfo;
