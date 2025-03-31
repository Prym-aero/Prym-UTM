import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_ENDPOINT;
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
      const res = await axios.post(
        `${API_URL}/zones/register`,
        formattedData
      );
      console.log("Response:", res.data);
      alert("Zone added successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding zone.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-screen h-screen  flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-[550px] p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-black/20 flex flex-col space-y-6">
      <h2 className="text-2xl font-semibold text-black text-center">Airspace Details</h2>
      
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
            <label className="text-black font-medium">Center (Lat,Lng)</label>
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
            <label className="text-black font-medium">Radius (meters)</label>
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
          <label className="text-black font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
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
    </>
  );
}

export default AirspaceForm;
