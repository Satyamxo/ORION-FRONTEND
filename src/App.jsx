import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import { useEffect } from "react";
import { connectSocket } from "./socket/socket";
import { jwtDecode } from "jwt-decode";
import { connectAuthSocket } from "./socket/authSocket";
import { useAuth } from "./context/AuthContext";
import { useIntro, IntroProvider } from "./context/IntroContext";
import IntroScreen from "./components/IntroScreen";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Events from "./pages/Events";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import MyProfile from "./pages/MyProfile";
import UserProfile from "./pages/UserProfile";
import PrivateChat from "./components/PrivateChat";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const AppLayout = () => {
  const { token } = useAuth();
  const { showIntro, completeIntro } = useIntro();
  const location = useLocation();

  useEffect(() => {
  if (!token) return;

  try {
    const decoded = jwtDecode(token);

    // 🔥 reconnect socket after refresh
    connectSocket(token, decoded.userId);
       connectAuthSocket(token, decoded.userId);

  } catch (err) {
    console.log("Invalid token");
  }
}, [token]);

  const isPrivateChatRoute =
    location.pathname.startsWith("/chat/private/");


  if (showIntro) {
  
    return <IntroScreen onComplete={completeIntro} />;
  }

  return (
    <>
      {/* Navbar only when logged in and not on auth/private-chat pages */}
      {token &&
        location.pathname !== "/login" &&
        location.pathname !== "/signup" &&
        !isPrivateChatRoute && <Navbar />}

      <Routes>
        {/* -------- PUBLIC ROUTES -------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* -------- PROTECTED ROUTES -------- */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/private/:userId"
          element={
            <ProtectedRoute>
              <PrivateChat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* -------- FALLBACK -------- */}
        <Route
          path="*"
          element={<Navigate to={token ? "/chat" : "/login"} replace />}
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <IntroProvider>
        <AppLayout />
      </IntroProvider>
    </BrowserRouter>
  );
}

export default App;