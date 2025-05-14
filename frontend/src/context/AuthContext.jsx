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
        throw new Error("No token found");
      }

      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Auto-login failed:", err);
      logout(); // Clear token and state
    } finally {
      setIsLoading(false);
    }
  };

  // On app load: check for token and fetch user
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Login: store token and fetch profile
  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const { token } = res.data;

      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await fetchUserProfile();
      toast.success(`Welcome back!`);
      return { success: true, role: res.data.user.role };
    } catch (error) {
      console.error("Login failed:", error);
      const msg = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    axiosInstance.defaults.headers.common["Authorization"] = "";
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
