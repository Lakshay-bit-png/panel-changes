import React from "react";
import user from "../../user.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const showhide=()=>{
    var a =document.querySelector('.sidepanel')
    if(a.style.display=='none'){
      a.style.display='flex'
    }
    else{a.style.display='none'}
  }
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
  const displayName = sessionStorage.getItem("username");
  const displayRole = sessionStorage.getItem("role");
  const accessToken = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();
  const redirectToLoginPage = () => {
    navigate("/");
  };
  const redirecttousermaster = () => {
    navigate("/user");
  };
  const redirecttoappinfo = () => {
    navigate("/appinfo");
  };
  const redirecttoroomsmaster = () => {
    navigate("/rooms");
  };
  const redirecttousers = () => {
    navigate("/allUsers");
  };
  if(displayRole === "Admin"){
  return (
    <><div className="hamburg" onClick={showhide}>
      <div className="line-1"></div>
      <div className="line-2"></div>
      <div className="line-3"></div>
    </div>
      <div className="sidepanel">
        <div className="header-panel">Admin Panel</div>
        <div className="s-2">
          <div className="my-profile">
            <img src={user} className="profile-img" />
            <div className="name">{displayName}</div>
          </div>
          <div className="partition"></div>

          <div className="option" onClick={redirecttousermaster}>
            Online Users
          </div>
          <div className="option" onClick={redirecttousers}>
            Users
          </div>
          {/* <div className="option" onClick={redirecttohost}>Host Master</div> */}
          <div className="option" onClick={redirecttoroomsmaster}>
            Rooms Master
          </div>
          {/* <div className="option">Cloud Recordings</div> */}
          <div className="option" onClick={redirecttoappinfo}>
            App Info
          </div>
          <div className="option" onClick={redirectToLoginPage}>
            Log Out
          </div>
          {/* <div className="option">Downloads</div>
                <div className="option">Logout</div> */}
        </div>
      </div>
      <div className="top-header">
        <div className="home"></div>
      </div>
    </>
  );}
  else {
    return (
        <>
          <div className="hamburg" onClick={showhide}>
      <div className="line-1"></div>
      <div className="line-2"></div>
      <div className="line-3"></div>
    </div>
          <div className="sidepanel">
            <div className="header-panel">Owner Panel</div>
            <div className="s-2">
              <div className="my-profile">
                <img src={user} className="profile-img" />
                <div className="name">{displayName}</div>
              </div>
              <div className="partition"></div>
              <div className="option" onClick={redirectToLoginPage}>
                Log Out
              </div>
            </div>
          </div>
          <div className="top-header">
            
          </div>
        </>
      );
  }
}

export default Sidebar;
