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

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
        } catch {
          localStorage.clear();
        }
      }

      setIsLoading(false); // ✅ only after check
    };

    checkAuthStatus();
  }, []);

  // Real login
const login = async (email, password) => {
  try {
    const res = await axiosInstance.post("/auth/login", { email, password });
    const { token, user: userData } = res.data;

    // Store full user info including profilePicture in localStorage
    const fullUserData = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      profilePicture: userData.profilePicture || null,
    };

    localStorage.setItem("user", JSON.stringify(fullUserData));
    localStorage.setItem("token", token);

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setUser(fullUserData);
    setIsAuthenticated(true);

    toast.success(`Welcome, ${userData.name || "User"}!`);
    return { success: true, role: userData.role };
  } catch (error) {
    console.error("Login failed:", error);
    const msg = error.response?.data?.message || "Login failed. Please try again.";
    toast.error(msg);
    return { success: false, message: msg };
  }
};


  const logout = () => {
    localStorage.removeItem("user");
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
