import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import LoginRegister from "./Components/auth/LoginRegister";
import OTP from "./Components/auth/OTP";
import Dashboard from "./Components/Home/Dashboard";
import Candidates from "./Components/Home/Candidates";
import AdminPanel from "./Components/admin/AdminDashboard";
import Home from "./Components/Home/Home";
import Profile from "./Components/routes/Profile";
import Verify from "./Components/routes/Verify";

const user = {
  name: "Pratik Chapagain",
  email: "prtkchapagain@gmail.com",
  verified: false,
  votingHistory: [
    { electionName: "Presidential Election 2024", date: "Jan 10, 2024" },
  ],
};

const elections = [
  { name: "Local Election 2025", date: "Mar 15, 2025" },
  { name: "Regional Election 2025", date: "Jul 20, 2025" },
];

const handleLogout = () => {
  console.log("Logging out...");
};

const App = () => {

  const role = localStorage.getItem('userRole');
  const isAdmin = role === 'admin' ? true : false;

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Redirect to admin panel if the user is admin */}
        <Route path="/" element= {<LoginRegister/> }/>
        <Route path="otp" element={<OTP />} />
        <Route path="dashboard" element={isAdmin ? <Navigate to="/adashboard" /> :<Dashboard />} />
        <Route path="candidates" element={<Candidates />} />

        {/* Admin Panel Route */}
        <Route path="adashboard" element={<AdminPanel />} />

        {/* Other Routes */}
        <Route path="home" element={<Home user={user} handleLogout={handleLogout} />} />
        <Route path="profile" element={<Profile user={user} />} />
        <Route path="verify" element={<Verify />} />
      </Route>
    </Routes>
  );
};

export default App;
