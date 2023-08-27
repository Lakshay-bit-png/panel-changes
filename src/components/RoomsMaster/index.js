import React from "react";
import Sidebar from "../Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RoomsMaster(){
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
        fetch("http://13.233.17.176:5001/api/admin/getrooms")
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
    
      const Number = usersInSpecificRooms.length;
      const chunkSize = 8;
      const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
    
      const handleNextChunk = () => {
        setCurrentChunkIndex(currentChunkIndex + 1);
      };
    
      const handlePreviousChunk = () => {
        setCurrentChunkIndex(currentChunkIndex - 1);
      };
      const handleDeleteRoom = async (idToDelete) => {
        console.log(idToDelete);
        await fetch(`http://13.233.17.176:5001/api/admin/deleteRoom/${idToDelete}`, {
          method: "DELETE",
        });
        console.log("deleted");
      };
    
      const handleRemoveRow = async (idToRemove) => {
        if (displayRole === "Owner" || displayRole === "Admin") {
          await handleDeleteRoom(idToRemove);
          setRows((prevData) =>
            prevData.filter((currentChunk) => currentChunk.roomId !== idToRemove)
          );
        }
      };
    
      const currentChunk = usersInSpecificRooms.slice(
        currentChunkIndex * chunkSize,
        (currentChunkIndex + 1) * chunkSize
      );
      const handleDisable = async (idToRemove) => {
        if (displayRole === "Owner" || displayRole === "Admin") {
          console.log(idToRemove);
          console.log("Calling Disable");
          await fetch(
            `http://13.233.17.176:5001/api/admin/disableRoom/${idToRemove}`,
            {
              method: "PUT",
            }
          );
          setRows((prevData) =>
            prevData.map((currentChunk) => {
              if (currentChunk.roomId === idToRemove) {
                return {
                  ...currentChunk,
                  isDisabled: true,
                };
              }
              return currentChunk;
            }));
          console.log("done");
        }
      };
      const handleEnable = async (idToRemove) => {
        if (displayRole === "Owner" || displayRole === "Admin") {
          console.log(idToRemove);
          console.log("calling enable");
          await fetch(
            `http://13.233.17.176:5001/api/admin/enableRoom/${idToRemove}`,
            {
              method: "PUT",
            }
          );
          setRows((prevData) =>
            prevData.map((currentChunk) => {
              if (currentChunk.roomId === idToRemove) {
                return {
                  ...currentChunk,
                  isDisabled: false,
                };
              }
              return currentChunk;
            }));
        }
      };
    
      const handleClick = async (isDisabled, idToRemove) => {
        if (isDisabled) {
          await handleEnable(idToRemove);
        } else {
          await handleDisable(idToRemove);
        }
      };
    const NavigationHistory = useNavigate();
    const redirectTOSignin = () => {
        NavigationHistory("/");
      };
    return(
        <>
        <Sidebar/>
        <div className="main-content-4">
            <div className="main-header-4">Rooms Master</div>
            <div className="room-count-table">
                <table className="main-table-4">
                    <thead style={{backgroundColor:'black',color:'white',fontSize:'16px',height:'30px'}}>
                        <tr>
                        <th>Room Name</th>
                        <th>Participants</th>
                        <th>Description</th>
                        <th>Password</th>
                        <th>Disable Room</th>
                        <th>Delete Room</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {currentChunk.map((user) => (
                    <tr key={user.userid}>
                      <td className="row2">{user.roomId}</td>
                      <td className="row2">{user.users.length}</td>
                      <td className="row2">{user.description}</td>
                      <td className="row2">{user.password}</td>
                      <td className="row2">
                        {/* Disabled: {user.isDisabled ? "Yes" : "No"} <br></br> */}
                        <button
                          className="update"
                          style={{
                            backgroundColor: user.isDisabled
                              ? "green"
                              : "orange",
                            color: "white",
                            fontSize: "15px",
                            padding: "10px",
                          }}
                          onClick={() =>
                            handleClick(user.isDisabled, user.roomId)
                          }
                        >
                          {user.isDisabled ? "Enable Room" : "Disable Room"}
                        </button>
                      </td>
                      <td className="row2">
                        <button
                          className="remove"
                          style={{
                            fontSize: "15px",
                            padding: "10px",
                          }}
                          onClick={() => handleRemoveRow(user.roomId)}
                        >
                          Delete Room
                        </button>
                      </td>
                    </tr>
                  ))}
                    </tbody>
                </table>
            </div>
        </div>

        </>
    )
}
export default RoomsMaster;