import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlertSnackbar from "../components/AlertSnackbar";
import { isTokenExpired, refreshAccessToken } from "../utils/authService"; // Import helper functions
const API_URL = import.meta.env.VITE_API_ENDPOINT;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [change, setChange] = useState("none");
  const [updatedUser, setupdatedUser] = useState(null);
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
        setupdatedUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error.response || error.message);
        localStorage.removeItem("accessToken");
        navigate("/"); // Redirect to login page
      }
    };

    fetchUser();
  }, [navigate]); // Run only when `navigate` changes

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login"); // Redirect to login page
  };

  const handleChange = (e) => {
     setupdatedUser({...updatedUser, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
     e.preventDefault();
      
     const updatedFields = Object.keys(updatedUser).reduce((acc, key) => {
        if (updatedUser[key] !== user[key]) {
           acc[key] = updatedUser[key];
        }

        return acc;
     },{});

     console.log("Updated fields:", updatedUserFields);

     if (Object.keys(updatedUserFields).length === 0) {
        showAlert("No changes made", "info");
        console.log("No changes made to the profile.");
        return;
     }

     try {
        const response = await axios.put(`${API_URL}/user/update`, updatedUserFields, {
            headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
        })

        console.log("Profile updated successfully:", response.data);
        showAlert("Profile updated successfully", "success");
        setUser(response.data);
        setupdatedUser(response.data);
     } catch (error) {
        console.error("Error updating profile:", error.response || error.message);
        showAlert("Error updating profile", "error");
     }
  }

  return (
    <>
      <Navbar />
      <div className="mt-13 mx-5  rounded-2xl flex flex-col justify-center items-center gap-2.5  bg-[#F9F9F9]  ">
        <h1
          className="text-black text-[34px] text-center mt-5 mb-2.5
          m-2 font-medium"
        >
          My Profile
        </h1>
        {user && (
          <div className="profile-info w-[97vw] h-screen bg-white flex flex-col justify-center items-center  shadow-2xl  m-2.5">
            <div className="profile w-full h-full flex flex-col justify-start items-center mx-15 gap-10 p-10 ">
              <div className="profile-card w-full h-[180px] mx-10  border-black border-[2px] rounded-3xl p-10  flex justify-evenly items-center">
                <div className="left-side w-[15%] h-full flex justify-center items-center ">
                  <div className="profile-img w-[150px] h-[150px] rounded-full ">
                     <img
                      src={user.image}
                      alt="profile"
                      className="w-full h-full object-cover rounded-full bg-white object-center"
                    />
                  </div>
                </div>
                <div className="right-side w-[85%] h-full relative flex flex-col justify-center items-start gap-1.5 p-10">
                  <div className="profile-name w-full h-[50px] flex  justify-start items-start text-2xl font-bold text-black gap-2">
                    <span className="text-2xl font-medium">Name:</span>
                    {user.name}
                  </div>
                  <div className="profile-role w-full h-[50px] flex justify-start  items-start text-2xl font-medium text-black gap-2">
                  <span className="text-2xl font-medium">Role:</span>
                    {user.role}
                  </div>
                  <div className="profile-role w-full h-[50px] flex justify-start  items-start text-2xl font-medium text-black gap-2">
                  <span className="text-2xl font-medium">username:</span>
                    {user.username}
                  </div>
                  <div className="profile-edit w-[100px] h-[40px] bg-gray-300 rounded-2xl absolute top-2.5 right-1.5 text-1xl font-bold text-black flex justify-center items-center cursor-pointer">
                    <span className="text-center">Edit</span>
                  </div>
                </div>
              </div>
              <div className="personal-info w-full h-[500px] mx-10 bg-blue-300 rounded-3xl"></div>
            </div>
          </div>
        )}
      </div>
      <AlertSnackbar alert={Alert} setAlert={setAlert} />
    </>
  );
};

export default Profile;
