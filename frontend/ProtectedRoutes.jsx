import React from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet, Navigate } from 'react-router-dom';
const location = useLocation();
const excludeHeaderRoutes = ["/login", "/otp"];
const shouldShowHeader = !excludeHeaderRoutes.includes(location.pathname);


function ProtectedRoutes() {
  const role = localStorage.getItem('userRole'); // Keep this if role-based access will be used
  const userId = localStorage.getItem('userId');
  
    const location = useLocation();
    const excludeHeaderRoutes = ["/login", "/otp"];
    const shouldShowHeader = !excludeHeaderRoutes.includes(location.pathname);

  // Check if user is authenticated
  return( <>
  {shouldShowHeader && <Header />}
    {userId ? <Outlet /> : <Navigate to="/login" replace />}
    </>
  )
}

export default ProtectedRoutes;
