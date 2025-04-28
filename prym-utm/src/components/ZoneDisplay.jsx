import React, { useState, useEffect } from "react";
import { Circle, Polygon, useMap } from "react-leaflet";
import getSectorPolygon from "./GetCordinatesSector";
import { IoClose } from "react-icons/io5";
import { MdMyLocation, MdOutlineReport } from "react-icons/md";

// ✅ Validation Helpers
const isValidLatLng = (point) =>
  Array.isArray(point) &&
  point.length === 2 &&
  typeof point[0] === "number" &&
  typeof point[1] === "number";

const isValidPolygon = (vertices) => {
  // Check if vertices is an array and has at least 3 points
  if (!Array.isArray(vertices) || vertices.length < 3) {
    return false;
  }

  // Helper function to validate a single coordinate
  const isValidCoordinate = (coord) => {
    if (!Array.isArray(coord) || coord.length !== 2) {
      return false;
    }
    const [lat, lng] = coord;
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  };

  // Validate each vertex
  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length]; // Wrap around to check closure

    // Check if the current vertex is valid
    if (!isValidCoordinate(current)) {
      return false;
    }

    // Check for duplicate consecutive points
    if (i > 0 && current[0] === next[0] && current[1] === next[1]) {
      return false;
    }
  }

  // Optionally, check if the polygon is closed (first and last vertices are the same)
  const firstVertex = vertices[0];
  const lastVertex = vertices[vertices.length - 1];
  if (firstVertex[0] !== lastVertex[0] || firstVertex[1] !== lastVertex[1]) {
    console.warn(
      "Warning: Polygon is not closed. First and last vertices differ."
    );
    // You can choose to enforce closure by uncommenting the line below:
    // return false;
  }

  return true;
};

const ZoneDisplay = ({ zone }) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const map = useMap();

  // ✅ Create custom panes for layering zones
  useEffect(() => {
    for (let i = 1; i <= 3; i++) {
      const paneName = `zonePane${i}`;
      if (!map.getPane(paneName)) {
        map.createPane(paneName);
        map.getPane(paneName).style.zIndex = 400 + i;
      }
    }
  }, [map]);

  const zoneInfo = (zone) => setSelectedZone(zone);

  return (
    <>
      {zone.map((zone, index) => {
        const paneName = `zonePane${(index % 3) + 1}`; // Rotate between zonePane1, zonePane2, zonePane3

        if (
          zone.type === "circle" &&
          isValidLatLng(zone.center) &&
          typeof zone.radius === "number"
        ) {
          return (
            <Circle
              key={index}
              center={zone.center}
              radius={zone.radius}
              color={zone.color}
              fillColor={zone.color}
              fillOpacity={0.5}
              pane={paneName}
              eventHandlers={{ click: () => zoneInfo(zone) }}
            />
          );
        }

        if (zone.type === "polygon" && isValidPolygon(zone.vertices)) {
          return (
            <Polygon
              key={index}
              positions={zone.vertices}
              color={zone.color}
              fillColor={zone.color}
              fillOpacity={0.5}
              pane={paneName}
              eventHandlers={{ click: () => zoneInfo(zone) }}
            />
          );
        }

        if (zone.type === "sector") {
          const sectorPolygon = getSectorPolygon(
            zone.center,
            zone.innerRadius,
            zone.outerRadius,
            zone.startAzimuth,
            zone.endAzimuth
          );

          return (
            <Polygon
              key={index}
              positions={sectorPolygon}
              color={zone.color}
              fillColor={zone.color}
              fillOpacity={0.5}
              pane={paneName}
              eventHandlers={{ click: () => zoneInfo(zone) }}
            />
          );
        }

        return null; // Skip invalid zone
      })}

      {selectedZone && (
        <div
          className={`${
            selectedZone ? "right-10" : "right-[-1000px]"
          } bg-white shadow-lg transition-all duration-200 pb-5 overflow-y-auto absolute z-[500] px-5 w-[388px] h-[80%] rounded-lg top-16`}
        >
          {/* Close Button */}
          <IoClose
            onClick={() => setSelectedZone(null)}
            className="absolute right-5 cursor-pointer text-red-600 text-[1.7rem] top-7"
          />

          {/* Drone Image */}
          <img
            src="/drone.png"
            className="object-cover mx-auto w-[240px]"
            alt="Drone"
          />

          {/* Location Header */}
          <div className="flex justify-between">
            <p className="text-base text-gray-700">Where you clicked</p>
            <MdMyLocation className="text-gray-600 text-[1.4rem]" />
          </div>
          <div className="bg-[#00000034] h-[1px] w-full my-2"></div>

          {/* Main Zone Information */}
          <div
            className="mt-5 border rounded-lg py-4 px-3 border-t-4"
            style={{ borderTopColor: selectedZone?.color || "#000000" }}
          >
            <p>
              <span>ZONE NAME: </span>
              {selectedZone?.name}
            </p>
            <p className="mt-2">
              <span>TYPE: </span>
              {selectedZone?.type}
            </p>
            <p className="mt-2">
              <span>AIRSPACE: </span>
              {selectedZone?.airspace}
            </p>
          </div>

          {/* Summary Section */}
          <div className="mt-4">
            <p className="font-medium">Summary</p>
            <div className="bg-[#00000034] h-[1px] w-full my-2"></div>
            <p className="text-sm text-gray-600">{selectedZone?.summary}</p>
          </div>

          {/* Location Details */}
          <div className="mt-4">
            <p className="font-medium">Location Details</p>
            <div className="bg-[#00000034] h-[1px] w-full my-2"></div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Address: </span>
              {selectedZone?.location}
            </p>
          </div>

          {/* Vertical Limits */}
          {selectedZone?.verticalLimits && (
            <div className="mt-4">
              <p className="font-medium">Vertical Limits</p>
              <div className="bg-[#00000034] h-[1px] w-full my-2"></div>
              <p className="text-sm text-gray-600">
                {selectedZone?.verticalLimits}
              </p>
            </div>
          )}

          {/* Regulations */}
          <div className="mt-4">
            <p className="font-medium">Regulations</p>
            <div className="bg-[#00000034] h-[1px] w-full my-2"></div>
            <p className="text-sm text-gray-600">{selectedZone?.regulation}</p>
          </div>

          {/* Prohibited Area */}
          {selectedZone?.prohibitedArea && (
            <div className="mt-4">
              <p className="font-medium">Prohibited Area</p>
              <div className="bg-[#00000034] h-[1px] w-full my-2"></div>
              <p className="text-sm text-gray-600">
                {selectedZone?.prohibitedArea}
              </p>
            </div>
          )}

          {/* Report Button */}
          <button className="rounded-full text-sm border border-black px-4 py-2 mt-10 mb-10 hover:bg-black hover:text-white transition-all duration-200 flex gap-2 items-center mx-auto">
            <MdOutlineReport className="text-[1.4rem]" /> Report a flight
            incident
          </button>
        </div>
      )}
    </>
  );
};

export default ZoneDisplay;
