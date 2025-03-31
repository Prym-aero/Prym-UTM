import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlertSnackbar from "../components/AlertSnackbar";
import { isTokenExpired, refreshAccessToken } from "../utils/authService"; // Import helper functions
const API_URL = import.meta.env.VITE_API_ENDPOINT;

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [Alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let token = localStorage.getItem("accessToken");
        if (!token) {
          showAlert("Login expired, please login again", "error");
          navigate("/");
          return;
        }

        if (isTokenExpired(token)) {
          console.warn("Access token expired, attempting refresh...");
          token = await refreshAccessToken(navigate); // ✅ Pass navigate here

          if (!token) {
            console.error("Unable to refresh token. Redirecting to login...");
            return;
          }
        }

        const response = await axios.get(`${API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // console.log("User profile fetched:", response.data);
        showAlert("Welcome to profile page", "success");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error.response || error.message);
        localStorage.removeItem("accessToken");
        navigate("/"); // Redirect to login page
      }
    };

    fetchUser();
  }, [navigate]);// Run only when `navigate` changes

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login"); // Redirect to login page
  };

  return (
    <>
      <Navbar />
      <div className="mt-15">
        <h1 className="text-red-500 text-[44px] text-center m-2">
          Welcome to the Profile page
        </h1>
        {user && (
          <div className="profile w-[100vw] h-[80vh] flex justify-center items-center bg-gray-300">
            <div className="userInfo w-[600px] h-[600px] flex flex-col gap-2 bg-white">
              <h1>{user.name}</h1>
              <h1>{user.username}</h1>
              <h1>{user.email}</h1>
            </div>
          </div>
        )}
      </div>
      <AlertSnackbar alert={Alert} setAlert={setAlert} />
    </>
  );
};

export default Profile;
