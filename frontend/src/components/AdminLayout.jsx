import { Outlet } from "react-router";
import { useState } from "react";
import Sidebar from "./admin/Sidebar.jsx";
import Topbar from "./admin/Topbar.jsx";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{
        "--sidebar-width": "clamp(16rem,18vw,20rem)",
      }}
    >
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="md:ml-[var(--sidebar-width)]">
        <Topbar setIsOpen={setIsOpen} />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;