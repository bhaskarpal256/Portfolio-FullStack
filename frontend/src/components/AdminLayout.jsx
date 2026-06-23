import { Outlet } from "react-router";
import Sidebar from "./admin/Sidebar.jsx";
import Topbar from "./admin/Topbar.jsx";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex">
      
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <main className="p-2 md:p-4">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;