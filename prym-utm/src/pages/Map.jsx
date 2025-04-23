const API_URL = import.meta.env.VITE_API_ENDPOINT;
import { TbBuildingAirport } from "react-icons/tb";
import L from "leaflet";
import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import Navbar from "../components/Navbar";
import CursorCoordinates from "../components/CursorCoordinates";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MapSidebarTailwind from "../components/MapSidebarTailwind";
import axios from "axios";
import ZoneDisplay from "../components/ZoneDisplay";
import { PiDroneBold } from "react-icons/pi";

const Map = () => {
  // const [drones, setDrones] = useState([]); // till now this is just for the checking drone is showing on the map or not
  const [zones, setZones] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [Airports, setAirports] = useState([]);
  const [ActiveIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/zones`);
        // console.log("Fetched Zones:", response.data); // Check the format here
        setZones(response.data);
      } catch (error) {
        console.error("Error fetching zones:", error);
      }
    };
    fetchData();
  }, []);

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

          {searchLocation && (
            <Marker position={searchLocation}>
              <Popup>position name</Popup>
            </Marker>
          )}

          <ZoneDisplay zone={zones} />

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
        </MapContainer>

        <MapSidebarTailwind />
      </div>
    </>
  );
};

export default Map;
