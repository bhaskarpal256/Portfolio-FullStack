import { Outlet } from "react-router";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />

      {/* This is where pages render */}
      <main className="p-2">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;