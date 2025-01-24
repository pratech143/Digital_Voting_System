import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import LoginRegister from "./Components/auth/LoginRegister";
import OTP from "./Components/auth/OTP";
import Dashboard from "./Components/Home/Dashboard";
import Candidates from "./Components/Home/Candidates";
import AdminPanel from "./Components/admin/AdminDashboard";
import Home from "./Components/Home/Home";
import Profile from "./Components/routes/Profile";
import Verify from "./Components/routes/Verify";



const App = () => {


  return (
    <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        {/* If user is not logged in, go to login page */}
        <Route
          path="/login"
          element={<LoginRegister />}
        />
        <Route path="otp" element={<OTP />} />
        <Route path="dashboard" element={ <Dashboard />} />
        <Route path="candidates" element={<Candidates />} />

        {/* Admin Panel Route */}
        <Route path="admin-dashboard" element={<AdminPanel />} />

        {/* Other Routes */}
        <Route path="home" element={<Home  />} />
        <Route path="profile" element={<Profile  />} />
        <Route path="verify" element={<Verify />} />
      </Route>
    </Routes>
    </BrowserRouter>
  );
};

export default App;
