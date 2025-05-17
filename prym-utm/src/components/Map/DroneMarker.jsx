import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { PiDroneBold } from "react-icons/pi";
import ReactDOMServer from 'react-dom/server';

const DroneMarker = ({ drone, isSelected }) => {
  const markerRef = useRef(null);

  // Dynamic styling
  const getMarkerStyle = () => {
    const baseStyle = {
      size: 22,
      color: '#3b82f6',
      className: ''
    };

    if (isSelected) {
      return {
        ...baseStyle,
        size: 26,
        color: '#1d4ed8',
        className: 'ring-2 ring-blue-500'
      };
    }

    switch(drone.status) {
      case 'alert':
        return { ...baseStyle, color: '#ef4444', className: 'animate-pulse' };
      case 'inactive':
        return { ...baseStyle, color: '#6b7280', size: 20 };
      default:
        return baseStyle;
    }
  };

  const style = getMarkerStyle();

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([drone.latitude, drone.longitude]);
      if (markerRef.current.setRotationAngle) {
        markerRef.current.setRotationAngle(drone.yaw);
      }
    }
  }, [drone]);

  return (
    <Marker
      position={[drone.latitude, drone.longitude]}
      icon={L.divIcon({
        html: ReactDOMServer.renderToString(
          <div className={style.className}>
            <PiDroneBold size={style.size} color={style.color} />
          </div>
        ),
        className: 'bg-transparent border-none',
        iconSize: [style.size + 8, style.size + 8],
        iconAnchor: [(style.size + 8)/2, (style.size + 8)/2]
      })}
      ref={markerRef}
      rotationAngle={drone.yaw}
      rotationOrigin="center"
      eventHandlers={{
        click: () => {
          if (markerRef.current) {
            markerRef.current.openPopup();
          }
        }
      }}
    >
      <Popup className="drone-popup">
        <div className="min-w-[200px] space-y-1">
          <h4 className="font-bold text-lg">{drone.id}</h4>
          <div><span className="font-medium">Status:</span> <span className={`capitalize ${drone.status === 'alert' ? 'text-red-500' : ''}`}>{drone.status}</span></div>
          <div><span className="font-medium">Position:</span> {drone.latitude.toFixed(6)}, {drone.longitude.toFixed(6)}</div>
          <div><span className="font-medium">Altitude:</span> {drone.altitude}m</div>
          <div><span className="font-medium">Battery:</span> <span className={drone.battery < 20 ? 'text-red-500 font-medium' : ''}>{drone.battery}%</span></div>
        </div>
      </Popup>
    </Marker>
  );
};

export default DroneMarker;