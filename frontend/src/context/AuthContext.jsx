import { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on reload
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

      // Handle Google OAuth redirect
      const params = new URLSearchParams(window.location.search);
      const authToken = params.get("token");
      const userString = params.get("user");

      if (authToken && userString) {
        const userData = JSON.parse(decodeURIComponent(userString));
        loginWithToken(userData, authToken);

        // clean URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    } catch (err) {
      console.error("Auth restore failed:", err);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ FIXED
  const signup = async (userData) => {
    try {
      const res = await api.post("/api/auth/signup", userData);
      return res.data;
    } catch (err) {
      console.error("Signup failed:", err);
      return {
        success: false,
        message: err?.response?.data?.message || err.message,
      };
    }
  };

  const handleAuthSuccess = (data) => {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  // ✅ FIXED
  const verifyOtp = async (otpData) => {
    try {
      const res = await api.post("/api/auth/verify-otp", otpData);
      if (res.data.success) handleAuthSuccess(res.data);
      return res.data;
    } catch (err) {
      console.error("OTP failed:", err);
      return {
        success: false,
        message: err?.response?.data?.message || err.message,
      };
    }
  };

  // ✅ FIXED
  const login = async (credentials) => {
    try {
      const res = await api.post("/api/auth/login", credentials);
      if (res.data.success) handleAuthSuccess(res.data);
      return res.data;
    } catch (err) {
      console.error("Login failed:", err);
      return {
        success: false,
        message: err?.response?.data?.message || err.message,
      };
    }
  };

  const loginWithToken = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const googleLogin = () => {
    const baseURL = api.defaults.baseURL;
    window.location.href = `${baseURL}/api/auth/google`;
  };

  const logout = () => {
    localStorage.clear();
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
