import React from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UsersMaster from "../components/UsersMaster";
import AppInfo from "../components/AppInfo";
import RoomsMaster from "../components/RoomsMaster";
import ViewUsers from "../components/ViewUsers";
import Login from "../components/LoginPage";
import AdminPage from "../components/AdminPage";
import AdminDetails from "../components/AdminDetailsPage";
import New from "../components/NewUser";
import NewAdmin from "../components/NewAdmin";

function AdminPanel() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/newadmin" element={<NewAdmin/>}></Route>
        <Route path="/user" element={<UsersMaster />}></Route>
        <Route path="/appinfo" element={<AppInfo />}></Route>
        <Route path="/rooms" element={<RoomsMaster />}></Route>
        <Route path="/allUsers" element={<ViewUsers />}></Route>
        <Route path="admin" element={<AdminPage />}></Route>
        <Route exact path="/admin/:adminId" element={<AdminDetails />} />
        <Route path="/newUser" element={<New />} />
      </Routes>
    </Router>
  );
}

export default AdminPanel;
