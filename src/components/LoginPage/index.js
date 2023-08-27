import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {
  sessionStorage.clear();
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");

  const handleInputChange = (event) => {
    setUserid(event.target.value);
  };
  const handleInputChange2 = (event) => {
    setPassword(event.target.value);
  };

  const NavigationHistory = useNavigate();

  const handlePostRequest = async () => {
    fetch("http://13.233.17.176:5001/api/admin/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userid,
        password: password,
      }),
    }).then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        sessionStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("roomId", JSON.stringify(data.roomId));
        if (data.role === "Owner") {
          NavigationHistory(`/admin`, { replace: true });
        } else {
          NavigationHistory(`/user`, { replace: true });
        }
      } else {
        alert("Invalid credentials");
      }
    });
  };
  const handleSubmit = async () => {
    await handlePostRequest();
  };
  return (
    <>
    <div className="background">
      <div className="login-box">
        <div className="heading-in">Sign In</div>
        <div className="main-div-form">
        <label htmlFor="id"className="heading2">Username :</label>
        <input
          type="text"
          className="textboxLog"
          name="userid"
          id="id"
          onChange={handleInputChange}
          placeholder="User123"
          value={userid}
        
        />
        </div>
        <div className="main-div-form">
        <label htmlFor ="password" className="heading2">Password :</label>
        <input
          type="password"
          className="textboxLog"
          name="userid"
          id="password"
          onChange={handleInputChange2}
          value={password}
          
          placeholder="&#xB7;&#183;&#183;&#183;&#183;&#183;"
        />
        </div>
        <h4 className="sec">
          For security reasons, your browsers cache is cleared.
        </h4>
        <h4 className="sec2">You have to login to perform any changes.</h4>
        <div className="button-login">
        <button className="button-2" onClick={handleSubmit}>
          Submit
        </button>
        </div>
      </div>
    </div>
 
    </>
  );
};

export default Login;