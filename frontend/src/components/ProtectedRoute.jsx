import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>

    if (!user) return <Navigate to="/login" replace /> //what replace does is when you go to /admin and if you're not logged in you are re-directed to /login but without replace if you click the back button on your browser when you're on the /login page is that you're sent back to /admin that again sends you to /login , so it becomes a unintentional back-button loop

    return <Outlet /> ;
};

export default ProtectedRoute;