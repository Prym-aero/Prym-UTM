import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_ENDPOINT;
import AlertSnackbar from "../components/AlertSnackbar";
function AirspaceForm() {
  const [airspaceData, setAirspaceData] = useState({
    type: "",
    name: "",
    center: "",
    radius: "",
    vertices: "",
    airspace: "",
    location: "",
    summary: "",
    verticalLimits: "",
    regulation: "",
  });

  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("add");
  const [allZones, setAllZones] = useState([]); 
  const [viewing, setViewing] = useState(null); // State to hold the zone being viewed

 const [Alert, setAlert] = useState({
     open: false,
     message: "",
     severity: "info",
   });
 
   const showAlert = (message, severity) => {
     setAlert({ open: true, message, severity });
   };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear conditional fields when type changes
    if (name === "type") {
      setAirspaceData({
        ...airspaceData,
        type: value,
        center: "",
        radius: "",
        vertices: "",
      });
    } else {
      setAirspaceData({ ...airspaceData, [name]: value });
    }
  };

  useEffect(()=> {
    const fetchZone = async () => {
        try {
            const response = await axios.get(`${API_URL}/zones`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('accessToken')}`}
            });

            setAllZones(response.data);
            showAlert("Zones fetched successfully", "success");   
        } catch (error) {
           console.error("error fetching zones", error);
           showAlert("Error in fetching zones", "error");
        }
    }

    fetchZone();
  },[])

  // Convert and submit data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Format the data
    const formattedData = {
      ...airspaceData,
      center: airspaceData.center
        ? airspaceData.center.split(",").map(Number)
        : [],
      vertices: airspaceData.vertices
        ? airspaceData.vertices
            .split("|")
            .map((pair) => pair.split(",").map(Number))
        : [],
    };

    console.log("Formatted Data:", formattedData);

    // Send data to API
    try {
      const res = await axios.post(`${API_URL}/zones/register`, formattedData);
      console.log("Response:", res.data);
     showAlert("Zone Added successfully", "success");
    } catch (error) {
      console.error("Error:", error);
      showAlert("Error adding zone.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete zone
  const handleDeletezone = async (zoneId) => {
     try {
        const response = await axios.delete(`${API_URL}/zones/${zoneId}`, {
           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });

        console.log("Zone deleted successfully:", response.data);
        showAlert("Zone deleted successfully", "success");
        setAllZones(allZones.filter((zone) => zone._id !== zoneId));
     } catch (error) {
        console.error("Error deleting zone:", error);
        showAlert("Error deleting zone", "error");
     }

  }

  return (
    <>
      <Navbar />

      <div className="Flight-btn flex justify-evenly items-center w-[750px] h-[100px] mt-20 ">
        <button
          className="F-btn px-4 py-2.5 text-white bg-black border-none rounded-4xl cursor-pointer "
          onClick={() => setView("add")}
        >
          Add Zone
        </button>
        <button
          className="F-btn px-4 py-2.5 text-white bg-black border-none rounded-4xl cursor-pointer "
          onClick={() => setView("all")}
        >
          All Zones
        </button>
      </div>

      {view === "add" && (
        <div className="w-screen h-screen flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="w-[550px] p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-black/20 flex flex-col space-y-6"
          >
            <h2 className="text-2xl font-semibold text-black text-center">
              Airspace Details
            </h2>

            <div className="flex flex-col">
              <label className="text-black font-medium">Type</label>
              <select
                name="type"
                value={airspaceData.type}
                onChange={handleChange}
                className="mt-1 px-3 py-2 rounded-lg bg-white/20 text-black placeholder-black/60 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Type</option>
                <option value="circle">Circle</option>
                <option value="polygon">Polygon</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-black font-medium">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                value={airspaceData.name}
                onChange={handleChange}
                className="mt-1 px-3 py-2 rounded-lg bg-white/20 text-black placeholder-black/60 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {airspaceData.type === "circle" && (
              <>
                <div className="flex flex-col">
                  <label className="text-black font-medium">
                    Center (Lat,Lng)
                  </label>
                  <input
                    type="text"
                    name="center"
                    placeholder="e.g. 12.34,56.78"
                    value={airspaceData.center}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 rounded-lg bg-white/20 text-black placeholder-black/60 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-black font-medium">
                    Radius (meters)
                  </label>
                  <input
                    type="number"
                    name="radius"
                    placeholder="Enter radius"
                    value={airspaceData.radius}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 rounded-lg bg-white/20 text-black placeholder-black/60 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </>
            )}

            {airspaceData.type === "polygon" && (
              <div className="flex flex-col">
                <label className="text-black font-medium">Vertices</label>
                <input
                  type="text"
                  name="vertices"
                  placeholder="e.g. 12.34,56.78|34.56,78.90"
                  value={airspaceData.vertices}
                  onChange={handleChange}
                  className="mt-1 px-3 py-2 rounded-lg bg-white/20 text-black placeholder-black/60 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )}

            {[
              "airspace",
              "location",
              "summary",
              "verticalLimits",
              "regulation",
            ].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-black font-medium">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  placeholder={`Enter ${field}`}
                  value={airspaceData[field]}
                  onChange={handleChange}
                  className="mt-1 px-3 py-2 rounded-lg bg-white/20 text-black placeholder-black/60 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-black font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      )}

      {view === "all" && (
        <div className="zoneShow w-screen h-full flex flex-col justify-center items-center bg-gray-100">
          <h1 className="text-3xl font-bold text-center mt-10">Zone Details</h1>
          <div className="zoneShow-container flex justify-center items-center mt-10">
            <table className="w-screen bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="flex justify-between items-center gap-10 w-full ">
                <tr className="bg-gray-200 flex justify-between items-center gap-10 w-full mx-[20px] px-[10px]">
                  <th className="p-4">Type</th>
                  <th className="p-4">Zone Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Vertical limits</th>
                  <th className="p-4">Airspace</th>
                </tr>
              </thead>
              <tbody>
                {/* Flight Plan data will be rendered here */}
                {allZones.map((zone, index) => (
                  <tr
                    key={index}
                    className="flex justify-between items-center gap-10 w-full mx-[20px] px-[10px]"
                  >
                    <td className="p-4">{zone.type}</td>
                    <td className="p-4">{zone.name}</td>
                    <td className="p-4">{zone.location}</td>
                    <td className="p-4">{zone.verticalLimits}</td>
                    <td className="p-4">{zone.airspace}</td>
                    <td className="p-4">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => setViewing(zone)}
                      >
                        View
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => handleDeletezone(zone._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AlertSnackbar alert={Alert} setAlert={setAlert}/>
    </>
  );
}

export default AirspaceForm;
