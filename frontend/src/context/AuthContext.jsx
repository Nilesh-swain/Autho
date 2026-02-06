import { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on load
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }

      // Check for Google auth params
      const params = new URLSearchParams(window.location.search);
      const authToken = params.get("token");
      const userString = params.get("user");
      if (authToken && userString) {
        try {
          const decodedUser = decodeURIComponent(userString);
          const userData = JSON.parse(decodedUser);
          if (userData && authToken) {
            loginWithToken(userData, authToken);
            // Clean URL
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname,
            );
          }
        } catch (err) {
          console.error("Error handling auth params:", err);
        }
      }
    } catch (error) {
      console.error("Failed to load user from localStorage:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = async (userData) => {
    try {
      const response = await api.post("/signup", userData);
      return response.data;
    } catch (error) {
      console.error("Signup failed:", error);
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const handleAuthSuccess = (data) => {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const verifyOtp = async (otpData) => {
    try {
      const response = await api.post("/verify-otp", otpData);
      if (response.data.success) {
        handleAuthSuccess(response.data);
      }
      return response.data;
    } catch (error) {
      console.error("OTP verification failed:", error);
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post("/login", credentials);
      if (response.data.success) {
        handleAuthSuccess(response.data);
      }
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const loginWithToken = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const googleLogin = () => {
    const baseURL = api.defaults.baseURL || "http://localhost:5000";
    window.location.href = `${baseURL.replace(/\/$/, "")}/api/auth/google`;
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        verifyOtp,
        loginWithToken,
        googleLogin,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
