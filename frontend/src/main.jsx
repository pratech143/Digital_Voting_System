import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/Store";
import AdminPanel from "./Components/admin/AdminDashboard.jsx";
import App from "./App";
import Dashboard from "./Components/Home/Dashboard";
import OTP from "./Components/auth/OTP";
import Candidates from "./Components/Home/Candidates";
import Home from "./Components/Home/Home";
import LoginRegister from "./Components/auth/LoginRegister";
import Header from "./Components/Header/Header"; // Import your Header component
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

const AppWithHeader = ({ children }) => {
  const location = useLocation();
  const excludeHeaderRoutes = ["/", "/otp"];
  const shouldShowHeader = !excludeHeaderRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      {children}
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <AppWithHeader>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<LoginRegister />} />
            <Route path="otp" element={<OTP />} />
            <Route
              path="dashboard"
              element={
                <Dashboard
                  
                />
              }
            />
            <Route path="candidates" element={<Candidates />} />
            <Route path="adashboard" element={<AdminPanel />} />
            <Route path="home" element={<Home user={user} handleLogout={handleLogout} />}/>
            <Route path="profile" element={<Profile user={user}/>} />
            <Route path="verify" element={<Verify/>}/>
            
          </Route>
        </Routes>
      </AppWithHeader>
    </BrowserRouter>
  </Provider>
);
