import { useState, useEffect } from "react";
// import "./admin.scss";
import '../../App.css';
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
const AdminPage = () => {
  const displayName = sessionStorage.getItem("username");
  const displayRole = sessionStorage.getItem("role");
  const accessToken = sessionStorage.getItem("accessToken");
  
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const displayRole = sessionStorage.getItem('role');
    if(!displayRole){
      redirectTOSignin();
    }
  },[]);

  useEffect(() => {
    fetch("http://13.233.17.176:5001/api/admin/getadmins")
      .then((response) => response.json())
      .then((data) => setRows(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // const chunkSize = 8;
  const Number = rows.length;
  const ActiveUsers = rows.filter((row) => row.isOnline === true).length;
  const StoppedUsers = rows.filter((row) => row.isOnline === false).length;
  // const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  // const handleNextChunk = () => {
  //   setCurrentChunkIndex(currentChunkIndex + 1);
  // };

  // const handlePreviousChunk = () => {
  //   setCurrentChunkIndex(currentChunkIndex - 1);
  // };

  // const currentChunk = rows.slice(
  //   currentChunkIndex * chunkSize,
  //   (currentChunkIndex + 1) * chunkSize
  // );

  const handleRemoveRow = async (idToRemove) => {
    if (displayRole === "Owner") {
      await handleDeleteUser(idToRemove);
      setRows((prevData) =>
        prevData.filter((currentChunk) => currentChunk.username !== idToRemove)
      );
    }
  };
  const handleDeleteUser = async (idToDelete) => {
    if (displayRole === "Owner") {
      await fetch(
        `http://13.233.17.176:5001/api/admin/deleteAdmin/${idToDelete}`,
        {
          method: "DELETE",
        }
      );
    }
  };
  const NavigationHistory = useNavigate();
    const redirectTOSignin = () => {
    NavigationHistory('/');
  };

  if (displayRole === "Owner") {
    return (
      <div className="home1">
        <Sidebar />
        <div className="mainScreen3">
          <div>
            <h1>Dashboard</h1>
          </div>
          <div className="cards">
            <div className="card1">
              <div className="text">Total Admins</div>
              <div className="number">{Number}</div>
            </div>
            <div className="card2">
              <div className="text">Online Admins</div>
              <div className="number">{ActiveUsers}</div>
            </div>
            <div className="card3">
              <div className="text">Stopped Admins</div>
              <div className="number">{StoppedUsers}</div>
            </div>
          </div>
          <div className="cards2">
            <div className="card4">
              <div className="text">
                <a href="/newadmin" className="link">
                  Add New
                </a>
              </div>
            </div>
            <div className="card5">
              <div className="text">
                <a href="/admin" className="link">
                  Refresh
                </a>
              </div>
            </div>
          </div>
          <div className="table">
            <div className="tableHeading">View Admins</div>
            <div className="tableData">
              <table className="UserList" border="1">
                <thead className="row1">
                  <tr>
                    <th>UserId</th>
                    <th>UserName</th>
                    <th>Rooms</th>
                    <th>Date </th>
                    <th>Control</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((user) => (
                    <tr key={user.userid}>
                      <td className="row2">
                        <a className="adlink" href={`/admin/${user.username}`}>
                          {user.username}
                        </a>
                      </td>
                      <td className="row2">{user.name}</td>
                      <td className="row2">{user.roomId.length}</td>
                      <td className="row2">
                        {user.dateCreated}
                      </td>
                      <td className="row2">
                        <button
                          className="remove"
                          onClick={() => handleRemoveRow(user.username)}
                        >
                          Delete Admin
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* <div className="pagination">
            <button
              className="paginationButton"
              onClick={handlePreviousChunk}
              disabled={currentChunkIndex === 0}
            >
              Previous
            </button>
            <button
              className="paginationButton"
              onClick={handleNextChunk}
              disabled={(currentChunkIndex + 1) * chunkSize >= rows.length}
            >
              Next
            </button>
          </div> */}
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

export default AdminPage;
