import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { IoHomeSharp } from "react-icons/io5";
import { MdFlight } from "react-icons/md";
import { RiArrowRightSLine } from "react-icons/ri";
import { GiSpanner } from "react-icons/gi";
import { FaMapMarkedAlt } from "react-icons/fa";
import { SlOrganization } from "react-icons/sl";
import { MdOutlineContactSupport } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import AlertSnackbar from "./AlertSnackbar";
import axios from "axios";

const Navbar = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isclicked, setIsclicked] = useState(false);
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRegistering, setIsRegistering] = useState(false);

  const [Alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  })

  const showAlert = (message, severity) => {
    setAlert({open: true, message, severity});
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    if (localStorage.getItem("accessToken")) {
      navigate("/profile");
    } else {
      setIsclicked(true);
    }
  };

  const [query, setQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // alert(`You have been logged out sucessfully`);
    showAlert("You have been logged out sucessfully", "success");
    navigate("/");
  };

  const handleSearch = async (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (!query) return; // Return if the query is empty

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
        );
        if (response.data.length > 0) {
          // Check if results exist
          const { lat, lon } = response.data[0];

          console.log("Location:", parseFloat(lat), parseFloat(lon));
          onSearch([parseFloat(lat), parseFloat(lon)]);
        } else {
          console.log("No results found for this location.");
        }
      } catch (error) {
        console.log("Error in fetching the location:", error);
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, name, email, password, role } = e.target.elements;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/register",
        {
          username: username.value,
          name: name.value,
          email: email.value,
          password: password.value,
          role: role.value,
        }
      );

      console.log(response.data);
      showAlert(response.data.message, "success");
      setIsRegistering(false);
      e.target.reset();
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        {
          email: email.value,
          password: password.value,
        }
      );

      console.log(response.data);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      showAlert("Logged in successfully", "success");
      navigate("/profile");
      e.target.reset();
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <>
      <nav className="p-4 flex justify-between items-center h-[60px] fixed w-full top-0 z-1000 bg-white-500">
        <div className="logo w-[250px] h-[50px] rounded-[15px] flex justify-center items-center">
          <div className="logo-text text-black font-bold text-[28px] text-left">
            Prym UTM
          </div>
        </div>

        <div className="right-section flex items-center gap-4">
          {location.pathname === "/" && (
            <div className="searchBar flex items-center gap-4">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search location..."
                  className="p-2 rounded-l-md bg-white focus:border-black focus:outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
                <button
                  className="bg-gray-200 px-4 py-2 rounded-r-md"
                  onClick={handleSearch}
                >
                  🔍
                </button>
              </div>
            </div>
          )}
          <div className="time-search flex items-center gap-2">
            <p className="text-black">{currentTime.toLocaleTimeString()}</p>
          </div>

          <div className="profile-icon">
            <button
              onClick={handleProfileClick}
              className="p-2 hover:opacity-70 text-black"
            >
              <FaUser size={24} />
            </button>
          </div>

          <button onClick={toggleMenu} className="menu-btn p-2">
            <div className="w-6 h-1 bg-black mb-1"></div>
            <div className="w-6 h-1 bg-black mb-1"></div>
            <div className="w-6 h-1 bg-black"></div>
          </button>
        </div>

        {/* Sidebar Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-[300px] bg-[#000000d8] px-5 text-white transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 text-white hover:opacity-70"
          >
            <IoMdClose size={24} />
          </button>

          <div className="mt-6 text-center">
            <p className="text-white font-bold">PRYM AEROSPACE</p>
            <p className="text-white">UTM SYSTEM</p>
          </div>
          <div className="h-[1px] bg-[#ffffff48] my-6 mx-auto"></div>

          <NavLink to="/profile">
            <div className="mt-4 flex gap-2 items-center cursor-pointer hover:opacity-70">
              <FaUser />
              <p>Profile</p>
            </div>
          </NavLink>

          <div
            className="mt-4 flex gap-2 items-center cursor-pointer hover:opacity-70"
            onClick={handleLogout}
          >
            <FiLogOut />
            <p>Logout</p>
          </div>
          <div className="h-[1px] bg-[#ffffff48] my-6 mx-auto"></div>

          <p>Current Organization:</p>
          <p className="mt-4 text-center font-medium">Personal</p>

          <div className="h-[1px] bg-[#ffffff48] my-6 mx-auto"></div>

          <NavLink to="/">
            <div className="mt-4 flex gap-2 items-center cursor-pointer hover:opacity-70">
              <IoHomeSharp />
              <p>Map</p>
            </div>
          </NavLink>

          <div className="h-[1px] bg-[#ffffff48] my-6 mx-auto"></div>

          <div>
            <p className="font-bold">My Records</p>

            <div className="mt-6 hover:opacity-70 flex justify-between items-center cursor-pointer">
              <div className="flex gap-3 items-center">
                <MdFlight className="rotate-[85deg] text-[1.4rem]" />
                <p>Aircraft</p>
              </div>
              <RiArrowRightSLine className="text-[1.4rem]" />
            </div>

            <div className="mt-6 hover:opacity-70 flex justify-between items-center cursor-pointer">
              <div className="flex gap-3 items-center">
                <GiSpanner />
                <p>Pilots</p>
              </div>
              <RiArrowRightSLine className="text-[1.4rem]" />
            </div>

            <NavLink to="/flightPlan">
              <div className="mt-6 hover:opacity-70 flex justify-between items-center cursor-pointer">
                <div className="flex gap-3 items-center">
                  <FaMapMarkedAlt />
                  <p>Flight Plans</p>
                </div>
                <RiArrowRightSLine className="text-[1.4rem]" />
              </div>
            </NavLink>
            <NavLink to="/addzone">
              <div className="mt-6 hover:opacity-70 flex justify-between items-center cursor-pointer">
                <div className="flex gap-3 items-center">
                  <SlOrganization />
                  <p>Add Zone</p>
                </div>
                <RiArrowRightSLine className="text-[1.4rem]" />
              </div>
            </NavLink>

            <div className="mt-6 hover:opacity-70 flex justify-between items-center cursor-pointer">
              <div className="flex gap-3 items-center">
                <MdOutlineContactSupport />
                <p>Support</p>
              </div>
              <RiArrowRightSLine className="text-[1.4rem]" />
            </div>
          </div>
        </div>
      </nav>
      {isclicked && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-500 flex justify-center items-center w-full h-full">
            <div className="login-box w-[400px] min-h-[450px] bg-white rounded-[15px] p-8 shadow-lg">
              <div className="text-center">
                <button
                  onClick={() => setIsclicked(false)}
                  className="float-right text-gray-500 hover:text-gray-700"
                >
                  <IoClose className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold mb-2">
                  {isRegistering ? "Register" : "Login"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {isRegistering
                    ? "Create a new account"
                    : "Please login to continue"}
                </p>

                {isRegistering ? (
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={handleRegister}
                  >
                    <select
                      name="role"
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option defaultValue={"user"}>Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      Register
                    </button>
                  </form>
                ) : (
                  <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                     <p
                      onClick={() => navigate('/reset-password')}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      >forgot password</p>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      Login
                    </button>
                  </form>
                )}

                <div className="mt-4">
                  <button
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {isRegistering
                      ? "Already have an account? Login"
                      : "Don't have an account? Register"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <AlertSnackbar alert={Alert} setAlert={setAlert} />
    </>
  );
};

export default Navbar;
