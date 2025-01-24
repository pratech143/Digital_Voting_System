import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Components/Header/Header";

const Layout = () => {
  const location = useLocation();
  const excludeHeaderRoutes = ["/login", "/otp"];
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
