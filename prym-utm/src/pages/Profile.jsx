import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import Snackbar from "@mui/material/Snackbar";
// import MuiAlert from "@mui/material/Alert";
// import { isTokenExpired, refreshAccessToken } from "../utils/authService";
import AlertSnackbar from "../components/AlertSnackbar";

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
        const token = localStorage.getItem("accessToken"); // Ensure token is stored correctly
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const response = await axios.get(
          "http://localhost:3000/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("User profile fetched:", response.data);
        showAlert("User fetched successfully", "success");
        setUser(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching user:", error.response || error.message);
        showAlert("Error fetching user", "error");
        localStorage.removeItem("accessToken");
        navigate("/"); // Redirect to home page
      }
    };

    fetchUser();
  }, [navigate]); // Add navigate to dependency array

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/"); // Redirect to home page
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:3000/api/user/profile");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/"); // Redirect to home page after account deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-15">
        <h1 className="text-red-500 text-[44px] text-center m-2">
          Welcome to the Profile page
        </h1>
        {user && (
          <>
            <div className="profile w-[100vw] h-[80vh] flex justify-center items-center bg-gray-300">
              <div className="userInfo w-[600px] h-[600px] flex flex-col gap-2 bg-white">
                <h1>{user.name}</h1>
                <h1>{user.username}</h1>
                <h1>{user.email}</h1>
              </div>
            </div>
          </>
        )}

        {/* <Snackbar
          open={Alert.open}
          autoHideDuration={3000}
          onClose={() => setAlert({ ...Alert, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity={alert.severity}
            onClose={() => setAlert({ ...Alert, open: false })}
          >
            {Alert.message}
          </MuiAlert>
        </Snackbar> */}
      </div>
      <AlertSnackbar alert={Alert} setAlert={setAlert} />
    </>
  );
};

export default Profile;
