import React, { useState, useEffect } from "react";
import { Circle, Polygon, useMap } from "react-leaflet";
import getSectorPolygon from "./GetCordinatesSector";
import { IoClose } from "react-icons/io5";

// ✅ Validation Helpers
const isValidLatLng = (point) =>
  Array.isArray(point) &&
  point.length === 2 &&
  typeof point[0] === "number" &&
  typeof point[1] === "number";
const isValidPolygon = (vertices) =>
  Array.isArray(vertices) && vertices.length > 0 && isValidLatLng(vertices[0]);

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

          if (isValidPolygon(sectorPolygon)) {
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
        }

        return null; // Skip invalid zone
      })}

      {selectedZone && (
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
          <p>Zone Center: {selectedZone.center?.join(", ")}</p>
          <p>Zone Radius: {selectedZone.radius}</p>
        </div>
      )}
    </>
  );
};

export default ZoneDisplay;
