// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
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
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LoginRegister />} />
        <Route path="otp" element={<OTP />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="adashboard" element={<AdminPanel />} />
        <Route path="home" element={<Home user={user} handleLogout={handleLogout} />} />
        <Route path="profile" element={<Profile user={user} />} />
        <Route path="verify" element={<Verify />} />
      </Route>
    </Routes>
  );
};

export default App;