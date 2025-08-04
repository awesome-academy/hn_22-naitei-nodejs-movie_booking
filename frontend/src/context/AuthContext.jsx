import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("accessToken") ? true : false
  );
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authAPI.login(credentials);
      const { accessToken, refreshToken } = response;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("isLoggedIn", "true");

      // Lấy tên user từ email (có thể cập nhật sau khi có API lấy thông tin user)
      const email = credentials.email;
      const name = email.split("@")[0];
      localStorage.setItem("userName", name);

      setIsLoggedIn(true);
      setUserName(name);

      return { success: true };
    } catch (error) {
      console.log("Login error:", error); // Debug log

      // NestJS trả về lỗi trong error.response.data
      if (error.response?.data) {
        return {
          success: false,
          error: error.response.data,
        };
      }

      return {
        success: false,
        error: { message: "Đăng nhập thất bại" },
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authAPI.register(userData);

      // Chỉ trả về thành công, không tự động đăng nhập
      return { success: true };
    } catch (error) {
      console.log("Register error:", error); // Debug log

      // NestJS trả về lỗi trong error.response.data
      if (error.response?.data) {
        return {
          success: false,
          error: error.response.data,
        };
      }

      return {
        success: false,
        error: { message: "Đăng ký thất bại" },
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userName");
      setIsLoggedIn(false);
      setUserName("");
    }
  };

  // Kiểm tra token khi component mount
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsLoggedIn(true);
      setUserName(localStorage.getItem("userName") || "");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userName,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
