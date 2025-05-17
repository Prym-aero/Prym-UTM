const API_URL = import.meta.env.VITE_API_ENDPOINT;
import { TbBuildingAirport } from "react-icons/tb";
import L, { geoJSON } from "leaflet";
import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import Navbar from "../components/Navbar";
import CursorCoordinates from "../components/Map/CursorCoordinates";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MapSidebarTailwind from "../components/Map/MapSidebarTailwind";
import axios from "axios";
import ZoneDisplay from "../components/Map/ZoneDisplay";
import { PiDroneBold } from "react-icons/pi";
import { FaFilter } from "react-icons/fa";
import { DrawControl } from "../components/Map/DrawItem";
import DroneTrackingLayer from "../components/Map/DroneTrackingLayer";
import DroneControlPanel from "../components/Map/DroneControlPanel";
import FlyToDrone from "../components/Map/FlyToDrone";

const Map = () => {
  // const [drones, setDrones] = useState([]); // till now this is just for the checking drone is showing on the map or not
  const [zones, setZones] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [Airports, setAirports] = useState([]);
  const [ActiveIndex, setActiveIndex] = useState(null);
  const [filter, setFilter] = useState(false);
  const [redZone, setRedZone] = useState(true);
  const [greenZone, setGreenZone] = useState(true);
  const [yellowZone, setYellowZone] = useState(true);
  const [redZoneData, setRedZoneData] = useState([]);
  const [greenZoneData, setGreenZoneData] = useState([]);
  const [yellowZoneData, setYellowZoneData] = useState([]);
  const [drones, setDrones] = useState({});
  const [selectedDrone, setSelectedDrone] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/zones`);
        // setZones(response.data);
        setZones(response.data);
        console.log(zones);
        console.log("Fetched Zones:", response.data.slice(0, 5)); // Check the format here
      } catch (error) {
        console.error("Error fetching zones:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Compute derived data whenever `zones` changes
    if (zones.length > 0) {
      setRedZoneData(zones.filter((zone) => zone.color === "red"));
      setGreenZoneData(zones.filter((zone) => zone.color === "green"));
      setYellowZoneData(zones.filter((zone) => zone.color === "yellow"));
    }
  }, [zones]);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await axios.get(`${API_URL}/airports`);
        // console.log("Fetched Airports:", response.data.slice(0, 5)); // Check the format here
        setAirports(response.data);
      } catch (error) {
        console.error("Error fetching airports:", error);
      }
    };
    fetchAirports();
  }, []);

  const activeZone = (index) => {
    setActiveIndex(index);
  };

  const airportIcon = L.divIcon({
    html: ReactDOMServer.renderToString(
      <TbBuildingAirport size={18} color="red" />
    ),
    className: "custom-icon",
    iconSize: [24, 24],
    backgroundColor: "white",
  });

  function SetViewOnSearch({ coords }) {
    const map = useMap(); // Get access to the Leaflet map object

    useEffect(() => {
      if (coords && Array.isArray(coords) && coords.length === 2) {
        const [lat, lon] = coords.map(Number); // Convert to numbers if needed
        if (!isNaN(lat) && !isNaN(lon)) {
          map.flyTo([lat, lon], 13); // Move to new location with zoom level 13
        }
      }
    }, [coords, map]); // Add `map` as a dependency to avoid issues

    return null;
  }

  const handleDroneUpdate = (updatedDrone) => {
    setDrones((prev) => ({
      ...prev,
      [updatedDrone.id]: updatedDrone,
    }));
  };

  const handleDrawCreated = (geoJSON) => {
    console.log("Created shape:", geoJSON);
  };

  const handleDrawEdited = (geoJSON) => {
    console.log("Edited shape:", geoJSON);
  };

  const handleDrawDeleted = (geoJSON) => {
    console.log("Deleted shape:", geoJSON);
  };

  // the dummy function to show drone ont the map
  // useEffect(() => {
  //   const fetchDroneData = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:3000/api/drones");
  //       console.log("Fetched data:", response.data); // Check if it's an array
  //       setDrones(response.data ? response.data : []); // Ensure an array
  //     } catch (error) {
  //       console.error("Error fetching drones:", error);
  //       setDrones([]); // Set to empty array on error
  //     }
  //   };

  //   fetchDroneData();
  // }, []);

  // const droneIcon = L.divIcon({
  //   html: ReactDOMServer.renderToString(
  //     <PiDroneBold size={18} color="black" />
  //   ),
  //   classsName: "custom-icon",
  //   iconSize: [24, 24],
  // });

  return (
    <>
      <Navbar onSearch={setSearchLocation} />
      <div className="map-container">
        <MapContainer
          center={[19.8347, 75.8816]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100svh" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <CursorCoordinates />

          <Marker position={[19.8347, 75.8816]}>
            <Popup>Jalna, Maharashtra</Popup>
          </Marker>

          <SetViewOnSearch coords={searchLocation} />

          <DrawControl
            onDrawCreated={handleDrawCreated}
            onDrawEdited={handleDrawEdited}
            onDrawDeleted={handleDrawDeleted}
          ></DrawControl>

          <DroneTrackingLayer
            selectedDrone={selectedDrone}
            onDroneUpdate={handleDroneUpdate}
          />

          <DroneControlPanel
            drones={drones}
            selectedDrone={selectedDrone}
            onSelectDrone={setSelectedDrone}
          />

          {selectedDrone && <FlyToDrone drone={drones[selectedDrone]} />}

          {searchLocation && (
            <Marker position={searchLocation}>
              <Popup>position name</Popup>
            </Marker>
          )}

          {redZone && <ZoneDisplay zone={redZoneData} />}
          {greenZone && <ZoneDisplay zone={greenZoneData} />}
          {yellowZone && <ZoneDisplay zone={yellowZoneData} />}

          {/* {Airports &&
            Airports.map((airport, index) => (
              <Marker
                key={index}
                position={[airport.latitude, airport.longitude]}
                icon={airportIcon}
              >
                <Popup>
                  <strong>{airport.name}</strong>
                  <br />
                  City: {airport.city}
                  <br />
                  Country: {airport.country}
                </Popup>
              </Marker>
            ))} */}
          {/* 
           {drones && drones.map((drone,index)=> (
              <Marker key={index} position={[drone.location.latitude, drone.location.longitude]} icon={droneIcon}>
                 <Popup>
                    <strong>Drone ID: {drone.droneName}</strong>
                    <br />
                    Latitude: {drone.latitude}
                    <br />
                    Longitude: {drone.longitude}
                 </Popup>
              </Marker>
           ))} */}
          <div className="filterbutton z-999 absolute top-15 right-3.25">
            <button
              className="F-btn px-4 py-2.5 text-white bg-black border-none rounded-4xl cursor-pointer z-1000 "
              onClick={() => setFilter(!filter)}
            >
              <FaFilter size={20} color="white" />
            </button>
          </div>
          {filter && (
            <div className="absolute top-45 right-10 z-[1000] bg-white shadow-lg transition-all duration-200 pb-5 overflow-y-auto px-5 w-[288px] h-[50%] rounded-lg">
              <h2 className="text-xl font-bold mb-4">Filter Zones</h2>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={redZone}
                  onChange={() => setRedZone(!redZone)}
                />
                <label className="ml-2">Red Zone</label>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={greenZone}
                  onChange={() => setGreenZone(!greenZone)}
                />
                <label className="ml-2">Green Zone</label>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={yellowZone}
                  onChange={() => setYellowZone(!yellowZone)}
                />
                <label className="ml-2">Yellow Zone</label>
              </div>
            </div>
          )}
        </MapContainer>
      </div>

      <MapSidebarTailwind />
    </>
  );
};

export default Map;
