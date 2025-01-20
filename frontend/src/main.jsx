import "./index.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';  
import store from "./redux/Store";

import App from './App';  
import Dashboard from "./Components/Home/Dashboard";
import OTP from "./Components/auth/OTP";
import Candidates from "./Components/Home/Candidates";
import Home from "./Components/Home/Home";
import LoginRegister from "./Components/auth/LoginRegister";

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
  // Add logout functionality
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}> 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<LoginRegister />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="dashboard" element={<Dashboard user={user} votingStatus={false} elections={elections} handleLogout={handleLogout} />} />
          <Route path="otp" element={<OTP />} />
          <Route path="home" element={<Home user={user} handleLogout={handleLogout} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);
