import React, { useState, useEffect } from "react";
import { Circle, Polygon, useMap } from "react-leaflet";
import getSectorPolygon from "../../utils/GetCordinatesSector";
import { IoClose } from "react-icons/io5";
import { MdMyLocation, MdOutlineReport } from "react-icons/md";
import { isValidLatLng, isValidPolygon } from "../../utils/validation";

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

  // ✅ Helper function to close polygons
  const closePolygon = (vertices, zoneName) => {
    if (!Array.isArray(vertices) || vertices.length < 3) return vertices;

    const firstVertex = vertices[0];
    const lastVertex = vertices[vertices.length - 1];

    // If the first and last vertices are not the same, close the polygon
    if (firstVertex[0] !== lastVertex[0] || firstVertex[1] !== lastVertex[1]) {
      console.log(`Closing polygon for zone "${zoneName}"`);
      return [...vertices, firstVertex]; // Append the first vertex to the end
    }

    return vertices; // Already closed
  };

  // ✅ Render all zones
  return (
    <>
      {zone.map((zone, index) => {
        const paneName = `zonePane${(index % 3) + 1}`;

        if (zone.type === "circle" && isValidLatLng(zone.center) && typeof zone.radius === "number") {
          return (
            <Circle
              key={index}
              center={zone.center}
              radius={zone.radius}
              color={zone.color}
              fillColor={zone.color}
              fillOpacity={0.5}
              pane={paneName}
              eventHandlers={{ click: () => setSelectedZone(zone) }}
            />
          );
        }

        if (zone.type === "polygon") {
          if (!isValidPolygon(zone.vertices, zone.name)) {
            zone.vertices = closePolygon(zone.vertices, zone.name); // Automatically close the polygon
          }

          return (
            <Polygon
              key={index}
              positions={zone.vertices}
              color={zone.color}
              fillColor={zone.color}
              fillOpacity={0.5}
              pane={paneName}
              eventHandlers={{ click: () => setSelectedZone(zone) }}
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
              eventHandlers={{ click: () => setSelectedZone(zone) }}
            />
          );
        }

        return null; // Skip invalid zone
      })}

      {/* Render zone details panel */}
      {selectedZone && (
        <div className="absolute z-[500] bg-white shadow-lg transition-all duration-200 pb-5 overflow-y-auto px-5 w-[388px] h-[80%] rounded-lg top-16 right-10">
          {/* Close Button */}
          <IoClose
            onClick={() => setSelectedZone(null)}
            className="absolute right-5 cursor-pointer text-red-600 text-[1.7rem] top-7"
          />

          {/* Drone Image */}
          <img src="/drone.png" alt="Drone" className="object-cover mx-auto w-[240px]" />

          {/* Location Header */}
          <div className="flex justify-between mt-4">
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
              <p className="text-sm text-gray-600">{selectedZone?.verticalLimits}</p>
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
              <p className="text-sm text-gray-600">{selectedZone?.prohibitedArea}</p>
            </div>
          )}

          {/* Report Button */}
          <button className="rounded-full text-sm border border-black px-4 py-2 mt-10 mb-10 hover:bg-black hover:text-white transition-all duration-200 flex gap-2 items-center mx-auto">
            <MdOutlineReport className="text-[1.4rem]" /> Report a flight incident
          </button>
        </div>
      )}
    </>
  );
};

export default ZoneDisplay;