const API_URL = import.meta.env.VITE_API_ENDPOINT;
import { IoClose } from "react-icons/io5";
import { TbBuildingAirport } from "react-icons/tb";
import L from "leaflet";
import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import Navbar from "../components/Navbar";
import CursorCoordinates from "../components/CursorCoordinates";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polygon,
  useMap,
} from "react-leaflet";
import MapSidebarTailwind from "../components/MapSidebarTailwind";
import axios from "axios";
import { PiDroneBold } from "react-icons/pi";

const Map = () => {
  // const [drones, setDrones] = useState([]); // till now this is just for the checking drone is showing on the map or not
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
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

  const zoneInfo = (zone) => {
    setSelectedZone(zone);
  };

  const activeZone = (index) => {
     setActiveIndex(index);
  }

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
          style={{ width: "100%", height: "100vh" }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

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

          {zones.map((zone, index) => {
            if (
              zone.type === "circle" &&
              Array.isArray(zone.center) &&
              zone.center.length === 2 &&
              zone.center.every((coord) => typeof coord === "number")
            ) {
              return (
                <Circle
                  key={index}
                  center={[zone.center[0], zone.center[1]]}
                  radius={zone.radius || 1000} // Default radius if missing
                  color={ActiveIndex === index ? zone.airspace : "transparent"}
                  fillColor={zone.airspace}
                  fillOpacity={0.5}
                  eventHandlers={{ click: () => {
                     zoneInfo(zone);
                     activeZone(index);
                     
                  }}}
                />
              );
            } else if (
              zone.type === "polygon" &&
              Array.isArray(zone.vertices)
            ) {
              const validVertices = zone.vertices.filter(
                (v) =>
                  Array.isArray(v) &&
                  v.length === 2 &&
                  v.every((coord) => typeof coord === "number")
              );

              if (validVertices.length > 2) {
                // At least 3 points required for a polygon
                return (
                  <Polygon
                    key={index}
                    positions={validVertices}
                    color={zone.airspace}
                    fillColor={zone.airspace}
                    fillOpacity={0.5}
                    eventHandlers={{ click: () => zoneInfo(zone) }}
                  />
                );
              }
            }
            return null;
          })}

          {Airports &&
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
            ))}
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

        {selectedZone && (
          <>
            <div className="zoneInfo w-[300px] h-[650px] absolute top-30 right-10 bg-white rounded-lg shadow-lg p-4 z-500">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold mb-2">Zone Information</h2>
                <button
                  onClick={() => setSelectedZone(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoClose className="w-6 h-6" />
                </button>
              </div>
              <p>Zone Name: {selectedZone.name}</p>
              <p>Zone Type: {selectedZone.type}</p>
              <p>Zone Location: {selectedZone.location}</p>
              <p>Zone Center: {selectedZone.center.join(", ")}</p>
              <p>Zone Radius: {selectedZone.radius}</p>
            </div>
          </>
        )}
      </div>

      
    </>
  );
};

export default Map;
