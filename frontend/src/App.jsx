import { Route, Routes } from "react-router";
import Home from "./pages/public/Home.jsx";
import Projects from "./pages/public/Projects.jsx";
import ProjectDetails from "./pages/public/ProjectDetails.jsx";
import Resume from "./pages/public/Resume.jsx";
import Contact from "./pages/public/Contact.jsx";
import Login from "./pages/public/Login.jsx";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Dashboard from "./pages/admin/Dashboard.jsx";
import ManageProjects from "./pages/admin/ManageProjects.jsx";
import Messages from "./pages/admin/Messages.jsx";
import ResumeUpdate from "./pages/admin/ResumeUpdate.jsx";
import Skills from "./pages/admin/Skills.jsx";
import Layout from "./components/Layout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <>
      <Toaster position="top-right"/>
    <Routes>
      {/* Public Routes */}
      <Route element={ <Layout /> }>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="edit-project" element={<ManageProjects />} />

          <Route path="messages" element={<Messages />} />

          <Route path="edit-resume" element={<ResumeUpdate />} />

          <Route path="edit-skills" element={<Skills />} />
        </Route>
      </Route>
    </Routes>
    </>
  );
}

export default App;
