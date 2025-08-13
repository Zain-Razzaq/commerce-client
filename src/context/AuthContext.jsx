import { createContext, useContext, useState, useEffect } from "react";
import { loginApi, signupApi, logoutApi } from "@/api/auth";
import toast from "react-hot-toast";
import { mergeCart, getLocalCart, clearLocalCart } from "@/api/cart";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const MergeCart = async () => {
  const localCart = getLocalCart();
  const response = await mergeCart(localCart);
  if (response.success) {
    clearLocalCart();
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("userInfo");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await loginApi(email, password);
    if (response.success) {
      setUser(response.data);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      MergeCart();
      toast.success("Login successful");
    } else {
      toast.error(response.error);
    }
    return response;
  };

  const signup = async (name, email, password) => {
    const response = await signupApi(name, email, password);
    if (response.success) {
      setUser(response.data);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      MergeCart();
      toast.success("Signup successful");
    } else {
      toast.error(response.error);
    }
    return response;
  };

  const logout = async () => {
    const response = await logoutApi();
    if (response.success) {
      setUser(null);
      clearLocalCart();
      localStorage.removeItem("userInfo");
      toast.success("Logout successful");
    } else {
      toast.error(response.error);
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
