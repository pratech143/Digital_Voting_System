import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Components/Header/Header"; // Import your Header component

const Layout = () => {
  const location = useLocation();
  const excludeHeaderRoutes = ["/", "/otp"]; // Routes where the header should be hidden
  const shouldShowHeader = !excludeHeaderRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
