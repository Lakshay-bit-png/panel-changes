import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../App.css";
import Sidebar from "../Sidebar";

const AdminDetails = () => {
  const displayName = sessionStorage.getItem("username");
  const displayRole = sessionStorage.getItem("role");
  const accessToken = sessionStorage.getItem("accessToken");
  const { adminId } = useParams();
  const [admin, setAdmin] = useState();
  const [roomData, setRoomData] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const [password, setNewPassword] = useState("");

  useEffect(() => {
    const apiUrl = `http://13.233.17.176:5001/api/admin/getAdmin/${adminId}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then(async (data) => await setAdmin(data), console.log(admin))
      .catch((error) => console.error("Error fetching admin details:", error));
  }, []);

  useEffect(() => {
    const displayRole = sessionStorage.getItem("role");
    if (!displayRole) {
      redirectTOSignin();
    }
  }, []);

  useEffect(() => {
    if (admin) {
      async function fetchData() {
        const fetchedData = [];
        for (const roomId of admin.admin.roomId) {
          try {
            const response = await fetch(
              `http://13.233.17.176:5001/api/admin/getRoom/${roomId}`
            );
            const data = await response.json();
            fetchedData.push(data);
          } catch (error) {
            console.error(`Error fetching data for room ${roomId}:`, error);
          }
        }
        setRoomData(fetchedData);
      }
      fetchData();
    }
  }, [admin]);

  const handleInputChange = (event) => {
    setNewRoom(event.target.value);
  };
  const handleInputChange2 = (event) => {
    setNewPassword(event.target.value);
  };
  const handlePutRequest = async () => {
    await handlePostReq();
    await fetch(
      `http://13.233.17.176:5001/api/admin/addRoom/${adminId}/${newRoom}`,
      {
        method: "PUT",
      }
    );
    setRoomData((prevData) => [
      ...prevData,
      {
        roomId: newRoom,
        password: password,
        description: `This is assigned to ${adminId}`,
      },
    ]);
  };

  const handlePostReq = async () => {
    if (displayRole === "Owner") {
      const response = await fetch(
        "http://13.233.17.176:5001/api/admin/createRoom",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId: newRoom,
            password: password,
            description: `This is assigned to ${adminId}`,
          }),
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (displayRole === "Owner") {
      await handlePutRequest();
    }
  };

  const NavigationHistory = useNavigate();
  const redirectToAdminPage = () => {
    NavigationHistory(`/admin/${adminId}`);
  };

  const handleDeleteRoom = async (idToDelete) => {
    if (displayRole === "Owner") {
      console.log(idToDelete);
      await fetch(
        `http://13.233.17.176:5001/api/admin/deleteRoom/${idToDelete}`,
        {
          method: "DELETE",
        }
      );
      console.log("deleted");
    }
  };
  const handleRemoveRow = async (idToRemove) => {
    if (displayRole === "Owner") {
      await handleDeleteRoom(idToRemove);
      setRoomData((prevData) =>
        prevData.filter((currentChunk) => currentChunk.roomId !== idToRemove)
      );
    }
  };

  const handleDisable = async (idToRemove) => {
    if (displayRole === "Owner") {
      console.log(idToRemove);
      console.log("calling disable");
      await fetch(
        `http://13.233.17.176:5001/api/admin/disableRoom/${idToRemove}`,
        {
          method: "PUT",
        }
      );
      console.log("done");
    }
    setRoomData((prevData) =>
      prevData.map((currentChunk) => {
        if (currentChunk.roomId === idToRemove) {
          return { ...currentChunk, isDisabled: true };
        }
        return currentChunk;
      })
    );
  };
  const handleEnable = async (idToRemove) => {
    if (displayRole === "Owner") {
      console.log(idToRemove);
      console.log("calling enable");
      await fetch(
        `http://13.233.17.176:5001/api/admin/enableRoom/${idToRemove}`,
        {
          method: "PUT",
        }
      );
    }
    setRoomData((prevData) =>
      prevData.map((currentChunk) => {
        if (currentChunk.roomId === idToRemove) {
          return { ...currentChunk, isDisabled: false };
        }
        return currentChunk;
      })
    );
  };
  const handleClick = async (isDisabled, idToRemove) => {
    if (isDisabled) {
      await handleEnable(idToRemove);
    } else {
      await handleDisable(idToRemove);
    }
  };
  const redirectTOSignin = () => {
    NavigationHistory("/");
  };
  if (displayRole === "Owner") {
    return (
      <div className="home1">
        <Sidebar />
        <div className="mainScreen2">
          {admin ? (
            <div>
              <h1 className="a">User Name : {admin.admin.username}</h1>
              <h1 className="a">Name : {admin.admin.name}</h1>
              <div
                className="new"
                style={{ display: "flex", alignItems: "center" }}
              >
                <h1 style={{ textAlign: "start", marginRight: "10px" }}>
                  {" "}
                  Assign New Room :{" "}
                </h1>
              </div>
              <div className="user-details-form">
              <div style={{ display: "flex", alignItems: "center" }}>
                <h3
                  style={{
                    textAlign: "start",
                    marginRight: "10px",
                    marginLeft: "80px",
                  }}
                >
                  Enter RoomID :{" "}
                </h3>
                <input
                  type="text"
                  className="textboxLog"
                  name="userid"
                  onChange={handleInputChange}
                  value={newRoom}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h3
                  style={{
                    textAlign: "start",
                    marginRight: "10px",
                    marginLeft: "20px",
                  }}
                >
                  Enter Room Password :{" "}
                </h3>
                <input
                  type="text"
                  className="textboxLog"
                  name="userid"
                  onChange={handleInputChange2}
                  value={password}
                />
              </div>
              <h3
                style={{
                  color: "red",
                  marginTop: "10px",
                  marginLeft: "100px",
                }}
              >
                Kindly make sure that the roomId isn't already assigned to
                another Admin.
              </h3>
              <div className="button">
                <button
                  className="update"
                  style={{
                    marginLeft: "90px",
                    backgroundColor: "blue",
                    color: "white",
                    width: "100px",
                    height: "35px",
                    marginTop: "10px",
                    borderRadius: "5px",
                    marginBottom: "20px",
                  }}
                  onClick={handleSubmit}
                >
                  Update
                </button>
              </div>
                  </div>
              {/* <a className="button-1" href={`/admin/${adminId}`}>
                <div className="buttonText">Refresh</div>
              </a> */}
              <h1 className="tableHeading">Rooms</h1>
              <table className="UserList" border="1">
                <thead className="row1">
                  <tr>
                    <th>Room </th>
                    <th>Room Password</th>
                    <th>Disable Room</th>
                    <th>Delete Room</th>
                  </tr>
                </thead>
                <tbody>
                  {roomData.map((room) => (
                    <tr key={room.roomId}>
                      <td>{room.roomId}</td>
                      <td>{room.password}</td>
                      <td className="row2">
                        {/* Disabled: {room.isDisabled ? "Yes" : "No"} <br></br> */}
                        <button
                          className="update"
                          style={{
                            width: "120px",
                            height: "35px",
                            backgroundColor: room.isDisabled ? "green" : "red",
                            color: "white",
                          }}
                          onClick={() =>
                            handleClick(room.isDisabled, room.roomId)
                          }
                        >
                          {room.isDisabled ? "Enable Room" : "Disable Room"}
                        </button>
                      </td>
                      <td className="row2">
                        <button
                          className="remove"
                          style={{
                            width: "120px",
                            height: "35px",
                          }}
                          onClick={() => handleRemoveRow(room.roomId)}
                        >
                          Delete Room
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <h1>Loading...</h1>
          )}
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
            This Screen is only for Owner.<br></br>Kindly Login Again.
          </h1>
        </div>
      </div>
    );
  }
};

export default AdminDetails;
