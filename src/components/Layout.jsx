import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Layout = () => {
  return (
    <div>
      <Header />

      {/* 👇 Yaha child pages render honge */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;