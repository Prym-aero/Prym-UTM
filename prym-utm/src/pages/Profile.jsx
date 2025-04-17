import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlertSnackbar from "../components/AlertSnackbar";
import { isTokenExpired, refreshAccessToken } from "../utils/authService"; // Import helper functions
const API_URL = import.meta.env.VITE_API_ENDPOINT;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [change, setChange] = useState(false);
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
    setupdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const updatedFields = Object.keys(updatedUser).reduce((acc, key) => {
      if (updatedUser[key] !== user[key]) {
        acc[key] = updatedUser[key];
      }

      return acc;
    }, {});

    console.log("Updated fields:", updatedUserFields);

    if (Object.keys(updatedUserFields).length === 0) {
      showAlert("No changes made", "info");
      console.log("No changes made to the profile.");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/user/update`,
        updatedUserFields,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log("Profile updated successfully:", response.data);
      showAlert("Profile updated successfully", "success");
      setUser(response.data);
      setupdatedUser(response.data);
    } catch (error) {
      console.error("Error updating profile:", error.response || error.message);
      showAlert("Error updating profile", "error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-14 mx-5 rounded-2xl flex flex-col justify-center items-center gap-4 bg-[#F9F9F9] min-h-screen">
        <h1 className="text-black text-[34px] text-center mt-6 mb-4 font-medium">
          My Profile
        </h1>
        {user && (
          <div className="profile-info w-full max-w-[1200px] bg-white flex flex-col justify-center items-center shadow-2xl rounded-3xl p-6">
            <div className="profile w-full flex flex-col justify-start items-center gap-10">
              {/* Profile Card */}
              <div className="profile-card w-full border border-blue-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-start md:justify-between items-center bg-gradient-to-r from-blue-50 via-white to-blue-100 shadow-lg transition-all duration-300">
                {/* Left Side: Image */}
                <div className="left-side mb-4 md:mb-0">
                  <div className="profile-img w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden shadow-md border-4 border-white">
                    <img
                      src={user.image}
                      alt="profile"
                      className="w-full h-full object-cover rounded-full object-center"
                    />
                  </div>
                </div>

                {/* Right Side: Info */}
                <div className="right-side flex-1 md:ml-10 w-full md:w-auto text-center md:text-left">
                  <div className="text-blue-900 text-lg md:text-xl font-semibold flex flex-col gap-2">
                    <div className="flex gap-2 justify-center md:justify-start">
                      <span className="font-medium text-gray-600">Name:</span>
                      <span className="text-black">{user.name}</span>
                    </div>
                    <div className="flex gap-2 justify-center md:justify-start">
                      <span className="font-medium text-gray-600">Role:</span>
                      <span className="text-black">{user.role}</span>
                    </div>
                    <div className="flex gap-2 justify-center md:justify-start">
                      <span className="font-medium text-gray-600">
                        Username:
                      </span>
                      <span className="text-black">{user.username}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Info Section */}
              <div className="personal-info w-full min-h-[300px] rounded-3xl bg-white border border-blue-100 shadow-md p-6 relative">
                <h2 className="text-2xl font-semibold text-blue-700 mb-4">
                  Personal Information
                </h2>

                <div className="grid  grid-cols-3 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-gray-700 font-medium">
                      Name:
                    </label>
                    {change ? (
                      <input
                        type="text"
                        name="phone"
                        value={updatedUser.name}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    ) : (
                      <p className="text-gray-800">{user.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 font-medium">
                      Email:
                    </label>
                    {change ? (
                      <input
                        type="email"
                        name="email"
                        value={updatedUser.email}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    ) : (
                      <p className="text-gray-800">{user.email}</p>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-gray-700 font-medium">
                      Role:
                    </label>
                    {change ? (
                      <input
                        type="email"
                        name="email"
                        value={updatedUser.role}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    ) : (
                      <p className="text-gray-800">{user.role}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-gray-700 font-medium">
                      Address:
                    </label>
                    {change ? (
                      <textarea
                        name="address"
                        value={updatedUser.address}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows="3"
                      />
                    ) : (
                      <p className="text-gray-800 whitespace-pre-line">
                        {user.address || "No address Provided"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="absolute top-0 right-0 flex gap-2 m-2.5">
                  {!change ? (
                    <div
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full cursor-pointer text-sm font-medium shadow-md transition"
                      onClick={() => setChange(true)}
                    >
                      Edit
                    </div>
                  ) : (
                    <>
                      <div
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-full cursor-pointer text-sm font-medium shadow-md transition"
                        onClick={handleSave}
                      >
                        Save
                      </div>
                      <div
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1.5 rounded-full cursor-pointer text-sm font-medium shadow-md transition"
                        onClick={() => {
                          setChange(false);
                          setupdatedUser({
                            email: user.email || "",
                            phone: user.phone || "",
                            address: user.address || "",
                          });
                        }}
                      >
                        Cancel
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <AlertSnackbar alert={Alert} setAlert={setAlert} />
    </>
  );
};

export default Profile;
