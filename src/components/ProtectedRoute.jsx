import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  // 🔄 Auth still loading (localStorage read not done yet)
  if (token === null) {
    return null; // or a loader
  }

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in
  return children;
};

export default ProtectedRoute;
