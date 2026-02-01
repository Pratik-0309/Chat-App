import { createContext, useState, useEffect, use } from "react";
import axiosInstance from "../lib/axiosInstance.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const AuthContext = createContext();

const backendURL = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const checkAuth = async () => {
    try {
      const { data } = await axiosInstance.get("/api/users/check-auth");
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Authentication check failed",
      );
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // function to handle socket connection and online users update
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendURL, {
      query: { userId: userData._id },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("get-online-users", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    backendURL,
    user,
    setUser,
    loading,
    setLoading,
    isAuthenticated,
    setIsAuthenticated,
    onlineUsers,
    setOnlineUsers,
    socket,
    setSocket,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
