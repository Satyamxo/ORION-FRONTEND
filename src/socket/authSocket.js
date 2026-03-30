import { io } from "socket.io-client";

let authSocket = null;

export const connectAuthSocket = (token, userId) => {
  if (authSocket && authSocket.connected) return authSocket;

  authSocket = io(import.meta.env.VITE_BLOCKED_SOCKET_URL, {
    auth: { token }
  });

  authSocket.on("connect", () => {
 

    authSocket.emit("register", userId.toString());
  });

  authSocket.on("forceLogout", (data) => {
    alert(data.message);
    localStorage.removeItem("token");
    window.location.href = "/login";
  });

  return authSocket;
};