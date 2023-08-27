import React from "react";
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";
import New from "../NewUser";

function ViewUsers() {
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
      .then((data) => setRows(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (displayRole === "Admin") {
    var usersInSpecificRooms = rows.filter((user) =>
      roomId.includes(user.roomId)
    );
  } else {
    var usersInSpecificRooms = rows;
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
  const ActiveUsers = usersInSpecificRooms.filter(
    (row) => row.isOnline === true
  ).length;
  const StoppedUsers = usersInSpecificRooms.filter(
    (row) => row.isOnline === false
  ).length;
  const Number = usersInSpecificRooms.length;

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
      changeStatusFalse(user);
    }
  };
  const handleRemoveRow = async (idToRemove) => {
    if (displayRole === "Admin") {
      await handleDeleteUser(idToRemove);
      setRows((prevData) =>
        prevData.filter((current) => current.username !== idToRemove)
      );
    }
  };

  const handleDeleteUser = async (idToDelete) => {
    if (displayRole === "Admin") {
      await fetch(
        `http://13.233.17.176:5001/api/admin/deleteUser/${idToDelete}`,
        {
          method: "DELETE",
        }
      );
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
    await fetch(
      `http://13.233.17.176:5001/api/admin/setUserMuted/${idToMute}`,
      {
        method: "PUT",
      }
    );
    setRows((prevData) =>
      prevData.map((current) => {
        if (current.username === idToMute) {
          return {
            ...current,
            isMuted: true,
          };
        }
        return current;
      })
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
    await fetch(
      `http://13.233.17.176:5001/api/admin/setUserUnmuted/${idToMute}`,
      {
        method: "PUT",
      }
    );
    setRows((prevData) =>
      prevData.map((current) => {
        if (current.username === idToMute) {
          return {
            ...current,
            isMuted: false,
          };
        }
        return current;
      })
    );
    console.log("Participant Unmuted");
  };

  const NavigationHistory = useNavigate();
  const redirectTOSignin = () => {
    NavigationHistory("/");
  };
  const redirectToAddUser = () => {
   document.querySelector('.mainScreen2').style.display='flex'
  };
  const redirectToUserPage = () => {
    NavigationHistory("/allUsers");
  };

  return (
    <>
      <Sidebar />
      <New/>
      <div className="main-content">
        <div className="user-traffic">
          <div className="total">
            <div className="total-number">{Number}</div>
            <div className="status-user">Total Users</div>
          </div>
          <div className="online">
            <div className="online-number">{ActiveUsers}</div>
            <div className="status-user">Online Users</div>
          </div>
          <div className="stopped">
            <div className="stopped-number">{StoppedUsers}</div>
            <div className="status-user">Stopped Users</div>
          </div>
        </div>
        <div className="functional-buttons">
          <div
            className="btn-1 "
            onClick={redirectToAddUser}
            style={{ fontSize: "20px" }}
          >
            Add New
          </div>
          <div
            className="btn-2"
            onClick={redirectToUserPage}
            style={{ fontSize: "20px" }}
          >
            Refresh
          </div>
          {/* <div className="btn-4">SwitchOff All</div> */}
        </div>
        <div className="table-of-content">
          <div className="outer-header">
            <div className="table-title">View Users</div>
          </div>
           <table className="main-table-1" border="1">
            <thead
              className="row1"
              style={{
                fontSize: "16px",
                backgroundColor: "rgb(25, 39, 77",
                color: "white",
              }}
            >
              <tr>
                <th>Name</th>
                <th>UserName</th>
                <th>Room</th>
                <th>Online</th>
                <th>Controls</th>
                <th>Mute/Unmute</th>
                <th>Cancel Audio</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {usersInSpecificRooms.map((user) => (
                
                  <tr key={user.username}>
                    <td className="row2">{user.name}</td>
                    <td className="row2">{user.username}</td>
                    <td classname="row2">{user.roomId}</td>
                    <td className="row2">{user.isOnline ? "Yes" : "No"}</td>
                    <td className="row2">
                      <button
                        className="remove"
                        onClick={() => handleRemoveRow(user.username)}
                      >
                        Delete User
                      </button>
                    </td>
                    <td>
                      {`isMuted: ${user.isMuted} `}
                      <br></br>
                      <button
                        className="update"
                        style={{
                          color: "black",
                          backgroundColor: "green",
                        }}
                        onClick={() =>
                          user.isMuted
                            ? handleUnmuteParticipant({
                                idToMute: user.username,
                                room: user.roomId,
                              })
                            : handleMuteParticipant({
                                idToMute: user.username,
                                room: user.roomId,
                              })
                        }
                      >
                        {user.isMuted ? "Unmute" : "Mute"}
                      </button>
                    </td>
                    <td>
                      {`Audio Subscribed : ${user.isAudioSubscribed}`}
                      <br></br>
                      <button className="remove">Cancel Audio</button>
                    </td>
                    <td>
                      <button
                        className="remove"
                        onClick={() =>
                          handleRemoveParticipant({
                            idToStop: user.roomId,
                            user: user.username,
                          })
                        }
                      >
                        Remove{" "}
                      </button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ViewUsers;