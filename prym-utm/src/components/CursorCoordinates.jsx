import { useState } from "react";
import { useMapEvents } from "react-leaflet";

const CursorCoordinates = () => {
  const [coords, setCoords] = useState({ lat: null, lng: null });

  useMapEvents({
    mousemove: (e) => {
      setCoords({ lat: e.latlng.lat.toFixed(6), lng: e.latlng.lng.toFixed(6) });
    },
  });

  return (
    <div className="absolute bottom-1 left-1 bg-white p-2 rounded shadow-md text-sm font-medium z-1000">
      <p>Lat: {coords.lat}, Lng: {coords.lng}</p>
    </div>
  );
};

export default CursorCoordinates;
