// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
     //console.log("isAuthenticated value after refresh outside of try",isAuthenticated);
    try {
      const res = await api.get("/auth/me", { withCredentials: true });
      //console.log("return from the auth/me: ", res);
      setUser(res.data.user);
      setIsAuthenticated(true);
       //console.log("isAuthenticated value after refresh inside of try",isAuthenticated);
    } catch (err) {
      try {
        await api.post("/auth/refresh", {}, { withCredentials: true });
        await new Promise((resolve) => setTimeout(resolve, 200));
        const res = await api.get("/auth/me", { withCredentials: true });
        setUser(res.data.user);
        setIsAuthenticated(true);
      // console.log("isAuthenticated value after refresh inside ofo try then catch",isAuthenticated);
      } catch {
        //console.log("this is error from checckAuth:",err);
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    let interval;
    if (isAuthenticated) {
      interval = setInterval(async () => {
        try {
          await api.post("/auth/refresh", {}, { withCredentials: true });
        } catch {
          logout();
        }
      }, 14 * 60 * 1000);
    }
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password }, { withCredentials: true });
    setUser(res.data.user);
    setIsAuthenticated(true);
  };

  const signup = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password }, { withCredentials: true });
    setUser(res.data.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);