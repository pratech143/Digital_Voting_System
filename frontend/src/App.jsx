import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import LoginRegister from "./Components/auth/LoginRegister";
import OTP from "./Components/auth/OTP";
import Dashboard from "./Components/Home/Dashboard";
import AdminDashboard from "./Components/admin/AdminDashboard";
import Profile from "./Components/routes/Profile";
import Verify from "./Components/routes/Verify";
import Vote from "./Components/routes/Vote";
import Results from "./Components/routes/Results";
import ProtectedRoutes from "../ProtectedRoutes";

const App = () => {
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");
  const isLoggedIn = userId ? true : false;

  return (
    <BrowserRouter>
      <Routes>
        {/* If user is not logged in, go to login page */}
        {!isLoggedIn && (
          <>
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/register" element={<LoginRegister />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </>
        )}

        <Route element={<ProtectedRoutes />}>
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/register" element={<Navigate to="/" />} />

          {userRole === "admin" ? (
            <>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/" element={<Navigate to="/admin-dashboard" />} />
              <Route path="/vote" element={<Navigate to="/" />} />
              <Route path="/results" element={<Navigate to="/" />} />
              <Route path="/profile" element={<Navigate to="/" />} />
              <Route path="/verify" element={<Navigate to="/" />} />
              <Route path="/otp" element={<Navigate to="/" />} />
              <Route path="/dashboard" element={<Navigate to="/" />} />

              
            </>
          ) :(
            <>
            <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/vote" element={<Vote />} />
              <Route path="/results" element={<Results />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/otp" element={<OTP />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin-dashboard" element={<Navigate to="/" />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
