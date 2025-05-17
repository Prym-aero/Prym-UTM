import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

const FlyToDrone = ({ drone }) => {
  const map = useMap();

  useEffect(() => {
    if (drone) {
      map.flyTo([drone.latitude, drone.longitude], map.getZoom(), {
        duration: 1
      });
    }
  }, [drone, map]);

  return null;
};

export default FlyToDrone;