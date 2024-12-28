

import "./index.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  
import App from './App';  // Import your main App component
import LoginRegister from './Components/auth/LoginRegister';
import Dashboard from "./Components/Home/Dashboard";
import OTP from "./Components/auth/OTP";

 ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<LoginRegister/>} />
        <Route path="dashboard" element={<Dashboard/>}/>
        <Route path="otp" element={<OTP/>}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
