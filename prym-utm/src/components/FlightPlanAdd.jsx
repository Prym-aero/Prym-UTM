import { useState, useEffect } from "react";
import axios from "axios";
// import Navbar from "../components/Navbar";
// import Snackbar from "@mui/material/Snackbar";
// import MuiAlert from "@mui/material/Alert";
import AlertSnackbar from "../components/AlertSnackbar";

const FlightPlanForm = () => {
  const [formData, setFormData] = useState({
    // userId: "", // User who created the flight
    flightName: "",
    locationName: "",
    center: { lat: null, lon: null }, // Prevents 'undefined' issues
    radius: 0, // Default numerical values to 0
    altitude: 0,
    speed: 0,
    duration: 0,
    flightDate: "", // Date input in string format

    // 🔹 Drone Details
    droneId: "",
    droneModel: "",
    batteryLevel: 100, // Default battery level at 100%

    // 🔹 Waypoints (Array)
    waypoints: [], // Empty array to start

    // 🔹 Pilot Information
    pilotId: "",
    pilotName: "",

    // 🔹 Flight Status
    status: "pending", // Default to 'pending'

    // 🔹 Regulatory & Safety Checks
    regulatoryApproval: false,
    safetyChecks: false,

    // 🔹 Environmental & Emergency Fields
    weatherConditions: "Unknown", // Default to 'Unknown'
    emergencyFailsafe: false,

    // 🔹 Additional Info
    logs: [], // Logs start empty
    notes: "",
  });

  const [Alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  // Function to fetch coordinates from OpenStreetMap (Nominatim)
  const fetchCoordinates = async (location) => {
    if (!location) return; // Prevent empty API calls

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location
        )}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0]; // Get first result
        setFormData((prevData) => ({
          ...prevData,
          center: { lat: parseFloat(lat), lon: parseFloat(lon) }, // Store coordinates
        }));
        console.log(formData.center);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  // useEffect to call fetchCoordinates whenever locationName changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCoordinates(formData.locationName);
    }, 1000); // Delay API call to prevent too many requests

    return () => clearTimeout(delayDebounceFn); // Cleanup to avoid unnecessary calls
  }, [formData.locationName]); // Runs only when locationName changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleNestedChange = (e, field) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [field]: { ...prev[field], [name]: value },
  //   }));
  // };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("🚀 handleSubmit triggered!");
    setMessage("");
    setAlert({ open: false, message: "", severity: "info" });

    const token = localStorage.getItem("accessToken");
    if (!token) {
      showAlert("No authentication token found. Please log in again.", "error");
      setLoading(false);
      return;
    }

    // ✅ Ensure `center.lat` and `center.lon` exist
    // if (!formData.center || formData.center.lat == null || formData.center.lon == null) {
    //     setAlert({ open: true, message: "Missing location coordinates (center.lat and center.lon)", severity: "error" });
    //     setLoading(false);
    //     return;
    // }

    // // ✅ Validate required fields before sending the request
    // if (!formData.flightName || !formData.locationName || !formData.flightDate || !formData.droneId || !formData.pilotId) {
    //     setAlert({ open: true, message: "Missing required flight details", severity: "error" });
    //     setLoading(false);
    //     return;
    // }

    // ✅ Convert string values to Boolean and ensure default values
    const processedFormData = {
      ...formData,
      regulatoryApproval: Boolean(formData.regulatoryApproval),
      safetyChecks: Boolean(formData.safetyChecks),
      batteryLevel: formData.batteryLevel || 100, // Default battery level
      waypoints: formData.waypoints || [], // Default to an empty array
      status: formData.status || "pending", // Default status
      weatherConditions: formData.weatherConditions || "Unknown",
      emergencyFailsafe: Boolean(formData.emergencyFailsafe),
    };

    console.log("🚀 Sending Data:", processedFormData); // Debugging Log

    try {
      const response = await axios.post(
        "http://localhost:3000/api/flightPlan/addFlight",
        processedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Flight Plan Saved:", response.data);
      setMessage("Flight plan saved successfully!");
      showAlert("Flight plan saved successfully!","success");

      // ✅ Reset form data with default values
      setFormData({
        flightName: "",
        locationName: "",
        center: { lat: 0, lon: 0 }, // Default center values
        radius: 0,
        altitude: 0,
        speed: 0,
        duration: 0,
        flightDate: "",
        droneId: "",
        droneModel: "",
        batteryLevel: 100,
        waypoints: [],
        pilotId: "",
        pilotName: "",
        status: "pending",
        regulatoryApproval: false,
        safetyChecks: false,
        weatherConditions: "Unknown",
        emergencyFailsafe: false,
        logs: [],
        notes: "",
      });
    } catch (err) {
      console.error("🚨 Error:", err.response?.data || err.message);
     showAlert("Error: " + (err.response?.data?.message || "Something went wrong"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
      <div className="w-screen h-full flex flex-col justify-center items-center  ">
        <div className="flight-form w-full bg-blue-200 h-[900px] ">
          <form
            className="w-full h-full bg-pink-100 p-8 rounded-lg shadow-lg grid grid-cols-2 gap-x-6 gap-y-4"
            onSubmit={handleSubmit}
          >
            {/* Flight Name */}
            <div className="flex flex-col w-full">
              <label className="text-black text-lg font-semibold mb-1">
                Flight Name
              </label>
              <input
                className="input-field bg-white/50 p-2.5"
                type="text"
                name="flightName"
                placeholder="Enter Flight Name"
                value={formData.flightName || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Location Name */}
            <div className="flex flex-col w-full">
              <label className="text-black text-lg font-semibold mb-1">
                Location Name
              </label>
              <input
                className="input-field bg-white/50 p-2.5"
                type="text"
                name="locationName"
                placeholder="Enter Location"
                value={formData.locationName || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Center Coordinates */}
            {/* <div className="flex flex-col w-full">
              <label className="text-black text-lg font-semibold mb-1">
                Latitude
              </label>
              <input
                className="input-field bg-white/50"
                type="number"
                step="any"
                name="lat"
                placeholder="Enter Latitude"
                value={formData.lat || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-black text-lg font-semibold mb-1">
                Longitude
              </label>
              <input
                className="input-field bg-white/50"
                type="number"
                step="any"
                name="lon"
                placeholder="Enter Longitude"
                value={formData.lon || ""}
                onChange={handleChange}
                required
              />
            </div> */}

            {/* Radius */}
            <div className="flex flex-col w-full">
              <label className="text-black text-lg font-semibold mb-1">
                Radius (meters)
              </label>
              <input
                className="input-field bg-white/50 p-2.5"
                type="number"
                name="radius"
                placeholder="Enter Radius"
                value={formData.radius || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Altitude */}
            <div className="flex flex-col w-full">
              <label className="text-black text-lg font-semibold mb-1">
                Altitude (m)
              </label>
              <input
                className="input-field bg-white/50 p-2.5"
                type="number"
                name="altitude"
                placeholder="Enter Altitude"
                value={formData.altitude || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Speed */}
            <div className="flex flex-col w-full">
              <label className="text-black text-lg font-semibold mb-1">
                Speed (m/s)
              </label>
              <input
                className="input-field bg-white/50 p-2.5"
                type="number"
                name="speed"
                placeholder="Enter Speed"
                value={formData.speed || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Duration */}
            <div className="flex flex-col w-full">
              <label className="text-black text-lg font-semibold mb-1">
                Duration (min)
              </label>
              <input
                className="input-field bg-white/50 p-2.5"
                type="number"
                name="duration"
                placeholder="Enter Duration"
                value={formData.duration || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Flight Date */}
            <div className="flex flex-col w-full">
              <label className="text-black text-lg font-semibold mb-1">
                Flight Date
              </label>
              <input
                className="input-field bg-white/50 p-2.5"
                type="datetime-local"
                name="flightDate"
                value={formData.flightDate || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Drone ID */}
            <div className="flex flex-col w-full">
              <label className="text-black text-lg font-semibold mb-1">
                Drone ID
              </label>
              <input
                className="input-field bg-white/50 p-2.5"
                type="text"
                name="droneId"
                placeholder="Enter Drone ID"
                value={formData.droneId || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Drone Model */}
            <div className="flex flex-col w-full">
              <label className="text-black text-lg font-semibold mb-1">
                Drone Model
              </label>
              <input
                className="input-field bg-white/50 p-2.5"
                type="text"
                name="droneModel"
                placeholder="Enter Drone Model"
                value={formData.droneModel || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Battery Level */}
            <div className="flex flex-col w-full">
              <label className="text-black text-lg font-semibold mb-1">
                Battery Level (%)
              </label>
              <input
                className="input-field bg-white/50 p-2.5"
                type="number"
                name="batteryLevel"
                placeholder="Enter Battery Level"
                value={formData.batteryLevel || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Waypoints */}
            {/* <div className="flex flex-col w-full">
              <label className="text-black text-lg font-semibold mb-1">
                Waypoints (JSON format)
              </label>
              <textarea
                className="input-field bg-white/50"
                name="waypoints"
                placeholder='[{"lat": 0, "lon": 0, "altitude": 0}]'
                value={formData.waypoints || ""}
                onChange={handleChange}
              />
            </div> */}

            {/* Pilot Id */}
            <div className="flex flex-col w-full">
              <label className="text-black text-lg font-semibold mb-1">
                Pilot Id
              </label>
              <input
                className="input-field  bg-white/50 p-2.5"
                type="text"
                name="pilotId"
                placeholder="Enter Pilot Id"
                value={formData.pilotId || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Pilot Name */}
            <div className="flex flex-col w-full">
              <label className="text-black text-lg font-semibold mb-1">
                Pilot Name
              </label>
              <input
                className="input-field  bg-white/50 p-2.5"
                type="text"
                name="pilotName"
                placeholder="Enter Pilot Name"
                value={formData.pilotName || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Flight Status */}
            <div className="flex flex-col w-full">
              <label className="text-black text-lg font-semibold mb-1">
                Flight Status
              </label>
              <select
                className="input-field bg-white/50 p-2.5"
                name="status"
                value={formData.status || "pending"}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Regulatory Approval */}
            <div className="flex flex-row items-center space-x-2 w-full">
              <input
                className="h-5 w-5 accent-blue-500 cursor-pointer p-2.5"
                type="checkbox"
                name="regulatoryApproval"
                checked={formData.regulatoryApproval || false}
                onChange={handleChange}
              />
              <label className="text-black text-lg font-semibold">
                Regulatory Approval
              </label>
            </div>

            {/* Safety Checks */}
            <div className="flex flex-row items-center space-x-2 w-full">
              <input
                className="h-5 w-5 accent-blue-500 cursor-pointer p-2.5"
                type="checkbox"
                name="safetyChecks"
                checked={formData.safetyChecks || false}
                onChange={handleChange}
              />
              <label className="text-black text-lg font-semibold">
                Safety Checks
              </label>
            </div>

            {/* Notes */}
            <div className="flex flex-col w-full col-span-2">
              <label className="text-black text-lg font-semibold mb-1">
                Additional Notes
              </label>
              <textarea
                className="input-field bg-white/50 p-2.5"
                name="notes"
                placeholder="Enter any additional comments"
                value={formData.notes || ""}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-2 mt-4">
              <button
                type="submit"
                className="w-full h-[50px] bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-md shadow-md transition-all duration-200"
              >
                {loading ? "Loading..." : "Submit Flight Plan"}
              </button>
            </div>
          </form>

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
      </div>

      <AlertSnackbar alert={Alert} setAlert={setAlert} />
    </>
  );
};

export default FlightPlanForm;
