import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch user from API using stored token
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      // Set the token in axios headers
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      const res = await axiosInstance.get("/auth/me");
      
      if (res.data) {
        setUser(res.data);
        setIsAuthenticated(true);
      } else {
        throw new Error("Invalid user data received");
      }
    } catch (err) {
      console.error("Auto-login failed:", err);
      // Only logout if it's not a network error
      if (err.response) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // On app load: check for token and fetch user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Login: store token and fetch profile
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/auth/login", { email, password });
      const { token, user: userData } = res.data;

      if (!token || !userData) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
      setIsAuthenticated(true);
      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true, role: userData.role };
    } catch (error) {
      console.error("Login failed:", error);
      const msg = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
    toast.info("You have been logged out");
  };

  const setPassword = async (email, password) => {
    try {
      setIsLoading(true);
      await axiosInstance.put("/auth/set-password", { email, password });
      toast.success("Password set successfully. Please login.");
      navigate("/login");
      return { success: true };
    } catch (error) {
      console.error("Set password failed:", error);
      const msg = error.response?.data?.message || "Failed to set password.";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated || !user) {
      navigate("/login");
      return null;
    }

    return children;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isLoading,
        login,
        logout,
        setPassword,
        ProtectedRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
