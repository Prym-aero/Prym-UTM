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
