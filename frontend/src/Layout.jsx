// Layout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Components/Header/Header"; // Adjust the path if needed
import baseApi from "./Api/baseApi";

const Layout = () => {
  const location = useLocation();
  const excludeHeaderRoutes = ["/", "/otp"];
  const shouldShowHeader = !excludeHeaderRoutes.includes(location.pathname);
  

  return (

    <>
      {shouldShowHeader && <Header />}
      <Outlet />
    </>
  );
};

export default Layout;