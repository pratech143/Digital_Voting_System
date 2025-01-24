import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Header from './src/Components/Header/Header';

function ProtectedRoutes() {
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");

  const excludeHeaderRoutes = ["/login", "/otp", "/register"];
  const shouldShowHeader = !excludeHeaderRoutes.includes(location.pathname);
  return (
    
    <>
    {shouldShowHeader && <Header />}
    {userRole ? <Outlet/> : <Navigate to="/login"/>}
    </>
  );
}

export default ProtectedRoutes;
