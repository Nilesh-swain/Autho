import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // 1. Initial Load: Check if user data exists in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  // 2. Standard Login (Email/Password)
  const login = async (credentials) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", credentials);
      if (data.success) {
        saveAuthData(data.user, data.token);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed" 
      };
    }
  };

  // 3. FIXED: Google Login Sync Function
  // This is what the Login.jsx calls after returning from Google
  const loginWithToken = (userData, userToken) => {
    saveAuthData(userData, userToken);
  };

  // Helper to prevent code duplication
  const saveAuthData = (userData, userToken) => {
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  // 4. Logout Logic
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        loading, 
        login, 
        loginWithToken, // Explicitly exported to be used in Login.jsx
        logout 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};