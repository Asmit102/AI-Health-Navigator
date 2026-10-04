import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getProfile, loginUser as apiLogin, signupUser as apiSignup } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const res = await getProfile();
          setUser(res.user);
          localStorage.setItem("user", JSON.stringify(res.user));
        } catch (err) {
          console.error("Session verification error:", err);
          if (err.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [logout]);

  const login = async (credentials) => {
    const data = await apiLogin(credentials);
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const signup = async (payload) => {
    const data = await apiSignup(payload);
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  const role = user?.role || "patient";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
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
