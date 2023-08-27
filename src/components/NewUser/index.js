import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "./new.css";
import "../../App.css";
import Sidebar from "../Sidebar";

export const New = () => {
  const displayName = sessionStorage.getItem("username");
  const displayRole = sessionStorage.getItem("role");
  const accessToken = sessionStorage.getItem("accessToken");
  const rooms = JSON.parse(sessionStorage.getItem("roomId"));
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const closepopup=()=>{
    document.querySelector('.mainScreen2').style.display='none'
  }
  useEffect(() => {
    const displayRole = sessionStorage.getItem("role");
    if (!displayRole) {
      redirectTOSignin();
    }
  }, []);

  const handleInputChange = (event) => {
    setRoomId(event.target.value);
  };
  const handleInputChange2 = (event) => {
    setUserId(event.target.value);
  };
  const handleInputChange3 = (event) => {
    setUserName(event.target.value);
  };
  const handleInputChange4 = (event) => {
    setUserPassword(event.target.value);
  };
  const NavigationHistory = useNavigate();
  const redirectToAdminPage = () => {
    NavigationHistory("/allUsers");
  };
  const handlePostRequest = async () => {
    if (displayRole === "Admin") {
      fetch("http://13.233.17.176:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          username: userId,
          roomId: roomId,
          password: userPassword,
          role: "User",
          deviceInfo: "",
          isOnline: false,
        }),
      });
    }
  };
  const savevalue=(event)=>{
    var x = event.target.value
    console.log(x)

  }
  const handleSubmit = async () => {
    if (displayRole === "Admin") {
      await handlePostRequest();
      redirectToAdminPage();
    }
  };
  const redirectTOSignin = () => {
    NavigationHistory("/");
  };

  if (displayRole === "Admin") {
    return (

     
      <div className="macbook-pro" style={{position:"absolute",display:'flex',justifyContent:'center',height:'400px',width:'100%'}}>
        
        {/* <div className="sidebar"> */}
        {/* <div className="userimg"></div>
        <div className="ownername">{displayName}</div>
        <div className="displayRole" style={{color: "white"}}>{displayRole}</div>
        <div className="title">
            <a href="/home" className="link">
              User Master
            </a>
          </div>
          <div className="title">
            <a href="/online" className="link">
              Online Users
            </a>
          </div>
          <div className="title">
            <a href="/announcements" className="link">
              App Info
            </a>
          </div> */}
        {/* <div className="title">
            <a href="/room" className="link">
              Room Master
            </a>
          </div>
        <div className="title">
          <a href="/" className="link">
            Log Out
          </a>
        </div>*/}
        {/* </div>  */}
        
        <div className="mainScreen2">
        <div onClick={closepopup} className="cross-pop" style={{position:'absolute',right:'10px',cursor:'pointer',top:'10px',display:'flex',gap:'2px',flexDirection:'column'}}>
          <div style={{width:'25px',height:'2px',backgroundColor:'black',transform:'rotate(45deg)'}}></div>
          <div style={{width:'25px',height:'2px',backgroundColor:'black',transform:'rotate(-45deg)',position:'relative',top:'-4px'}}></div>
        </div>
          <div>
            <h1 className="heading">Add New User</h1>
          </div>
          <div className="input1" style={{position:'relative'}}>
          <label htmlFor="u_id" >UserId:{" "}</label>
            <input
              type="text"
              
              id="u_id"
              className="textbox"
              name="userid"
              onChange={handleInputChange2}
              value={userId}
              
            />
            
          </div>
          <div className="input2">
           <label>UserName:{" "}</label> 
            <input
              type="text"
              className="textbox"
              name="userid"
              onChange={handleInputChange3}
              value={userName}
            />
          </div>
          <div className="input3">
            <label>Password:{" "}<br /></label>
            <input
              type="text"
              className="textbox"
              name="userid"
              onChange={handleInputChange4}
              value={userPassword}
            />
          </div>
          <div className="input4">
            <label>RoomId:{" "}<br /></label>
            <input
              type="select"
              className="textbox"
              name="userid"
              onChange={handleInputChange}
              value={roomId}
            />
          </div>
          <div className="input5">
            <label>Room No</label><br/>
            <select onChange={savevalue}>
              <option>Room No-1</option>
              <option>Room No-2</option>
              <option>Room No-3</option>
              <option>Room No-4</option>
              <option>Room No-5</option>
              <option>Room No-6</option>
            </select>
          </div>
          <button className="button-admin" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      
      </div>
      
    );
  } else {
    return (
      <div className="home">
        {/* <div className="sidebar">
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
        </div> */}
        <Sidebar />
        <div className="mainScreen">
          <h1>
            This Screen is only for Admin.<br></br> Kindly Login Again.
          </h1>
        </div>
      </div>
    );
  }
};

export default New;
