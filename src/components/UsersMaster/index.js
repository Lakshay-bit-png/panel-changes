import React from "react";
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/index";
import { useNavigate } from "react-router-dom";

function UsersMaster() {
  const displayName = sessionStorage.getItem("username");
  const displayRole = sessionStorage.getItem("role");
  const accessToken = sessionStorage.getItem("accessToken");
  const roomId = JSON.parse(sessionStorage.getItem("roomId"));
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const displayRole = sessionStorage.getItem("role");
    if (!displayRole) {
      redirectTOSignin();
    }
  }, []);

  useEffect(() => {
    fetch("http://13.233.17.176:5001/api/admin/getusers")
      .then((response) => response.json())
      .then((data) => setRows(data),
      console.log(rows))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (displayRole === "Admin") {
    var usersInSpecificRooms = rows.filter(
      (user) => roomId.includes(user.roomId) 
      // && user.isOnline === true
    );
  } else {
    var usersInSpecificRooms = rows.filter((user) => user.isOnline === true);
  }
  function groupUsersByRoom(users) {
    const groupedUsers = {};

    users.forEach((user) => {
      const { roomId, ...userData } = user;
      if (!groupedUsers[roomId]) {
        groupedUsers[roomId] = [];
      }
      groupedUsers[roomId].push(userData);
    });

    return groupedUsers;
  }

  const usersGrouped = groupUsersByRoom(usersInSpecificRooms);
  console.log(usersGrouped);
  // const ActiveUsers = usersInSpecificRooms.filter(
  //   (row) => row.isOnline === true
  // ).length;
  // const StoppedUsers = usersInSpecificRooms.filter(
  //   (row) => row.isOnline === false
  // ).length;
  // const Number = usersInSpecificRooms.length;

  const NavigationHistory = useNavigate();
  const redirectTOSignin = () => {
    NavigationHistory("/");
  };
  const redirecttousermaster = () => {
    NavigationHistory("/user");
  };
  const handleEndRoom = async (idToStop) => {
    if (displayRole === "Admin") {
      await getLivekitTOken(idToStop);
      const tokenVal = sessionStorage.getItem("token");
      console.log(tokenVal);
      await fetch(
        `https://livekit.zoomtod.com/twirp/livekit.RoomService/DeleteRoom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenVal}`,
          },
          body: JSON.stringify({
            room: idToStop,
          }),
        }
      );
      for (let i = 0; i < usersGrouped[idToStop].length; i++) {
        await changeStatusFalse(usersGrouped[idToStop][i].username);
      }
    }
  };

  const handleRemoveParticipant = async ({ idToStop, user }) => {
    if (displayRole === "Admin") {
      await getLivekitTOken(idToStop);
      const tokenVal = sessionStorage.getItem("token");
      console.log(tokenVal);
      await fetch(
        `https://livekit.zoomtod.com/twirp/livekit.RoomService/RemoveParticipant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenVal}`,
          },
          body: JSON.stringify({
            room: idToStop,
            identity: user,
          }),
        }
      );
      await changeStatusFalse(user);
      console.log("Participant Removed");
    }
  };

  const getLivekitTOken = async (room) => {
    const response = await fetch(
      "http://13.233.17.176:5001/api/livekit/adminToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identity: displayName,
          room: room,
        }),
      }
    ).then(async (response) => {
      const data = await response.json();
      console.log(data.token);
      sessionStorage.setItem("token", data.token);
    });
  };
  const handleMuteParticipant = async ({ idToMute, room }) => {
    await handleGetSID({ idToGet: idToMute, room: room });
    const tokenVal = sessionStorage.getItem("token");
    const sidVal = sessionStorage.getItem("sid");
    console.log(tokenVal);
    console.log(sidVal);
    await fetch(
      `https://livekit.zoomtod.com/twirp/livekit.RoomService/MutePublishedTrack`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenVal}`,
        },
        body: JSON.stringify({
          room: room,
          identity: idToMute,
          track_sid: sidVal,
          mute: true,
        }),
      }
    );
    console.log("Participant Muted");
  };

  const handleUnmuteParticipant = async ({ idToMute, room }) => {
    await handleGetSID({ idToGet: idToMute, room: room });
    const tokenVal = sessionStorage.getItem("token");
    const sidVal = sessionStorage.getItem("sid");
    console.log(tokenVal);
    console.log(sidVal);
    await fetch(
      `https://livekit.zoomtod.com/twirp/livekit.RoomService/MutePublishedTrack`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenVal}`,
        },
        body: JSON.stringify({
          room: room,
          identity: idToMute,
          track_sid: sidVal,
          mute: false,
        }),
      }
    );
    // setIsmuted(false);
    setRows((prevData) =>
      prevData.map((current) => {
        if (current.username === idToMute) {
          return {
            ...current,
            ismuted: false,
          };
        }
        return current;
      })
    );
    console.log("Participant Unmuted");
  };

  const changeStatusFalse = async (idToChange) => {
    if (displayRole === "Admin") {
      await fetch(
        `http://13.233.17.176:5001/api/user/changeStatusFalse/${idToChange}`,
        {
          method: "PUT",
        }
      );
      setRows((prevData) =>
        prevData.map((current) => {
          if (current.username === idToChange) {
            return {
              ...current,
              isOnline: false,
            };
          }
          return current;
        })
      );
    }
  };

  const handleGetSID = async ({ idToGet, room }) => {
    if (displayRole === "Admin") {
      await getLivekitTOken(room);
      const tokenVal = sessionStorage.getItem("token");
      console.log(tokenVal);
      await fetch(
        `https://livekit.zoomtod.com/twirp/livekit.RoomService/GetParticipant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenVal}`,
          },
          body: JSON.stringify({
            room: room,
            identity: idToGet,
          }),
        }
      ).then(async (response) => {
        const data = await response.json();
        console.log(data.sid);
        sessionStorage.setItem("sid", data.sid);
      });
    }
  };
  return (
    <>
      <Sidebar />
      <div className="main-content-3">
        <div className="outer-header-3">
          <button className="Refresh">
            <a href="/user" style={{ textDecoration: "None", color: "black" }}>
              Refresh
            </a>
          </button>
          <button className="Logout-All">Logout All</button>
        </div>
        <div className="inner-header">
        Rooms Online
        </div>
         {Object.keys(usersGrouped).map((room) => (
        <div className="rooms" key={room}>
          <div className="Room-1">
            <div className="header-room" style={{display:"flex"}}>
              {room}
              <button
              style={{backgroundColor:"red", color:"white", border:"none", borderRadius:"5px", padding:"5px",}}
                // onClick={() => handleEndRoom(room)}
              >
                End Room
              </button>
              <button
              style={{backgroundColor:"red", color:"white", border:"none", borderRadius:"5px", padding:"5px",}}
                // onClick={() => handleEndRoom(room)}
              >
                Mute All
              </button>
              </div>
          <div className="user-boxes">
            {usersGrouped[room].map((user, index) => (
                <div key={index} style={{display:'flex',gap:'5px',height:'auto',flexWrap:'wrap',justifyContent:'center'}}>
                  <div className="rounded-box">{user.username}</div>
                  
                </div>
              ))}
            </div>
          </div>
          
          
          
          
          
        </div>
      ))}
      </div>
    </>
  );
}

export default UsersMaster;
