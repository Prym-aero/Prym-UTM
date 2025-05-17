import { useState, useEffect } from 'react';
import { Polyline } from 'react-leaflet';
import useDroneSocket from './useDroneSocket';
import DroneMarker from './DroneMarker';

const DroneTrackingLayer = ({ selectedDrone, onDroneUpdate }) => {
  const [drones, setDrones] = useState({});
  const { subscribe, onUpdate, onAlert } = useDroneSocket();

  // Initialize with drones from backend
  useEffect(() => {
    const fetchInitialDrones = async () => {
      try {
        const response = await fetch('http:localhost:3000/api/drones');
        const initialDrones = await response.json();
        initialDrones.forEach(drone => {
          subscribe(drone.id);
          setDrones(prev => ({
            ...prev,
            [drone.id]: {
              ...drone,
              path: [[drone.latitude, drone.longitude]],
              lastUpdated: Date.now()
            }
          }));
        });
      } catch (error) {
        console.error("Failed to fetch initial drones:", error);
      }
    };

    fetchInitialDrones();
  }, [subscribe]);

  // Handle real-time updates
  useEffect(() => {
    const handleUpdate = (update) => {
      setDrones(prev => {
        const existing = prev[update.droneId] || {};
        const updatedDrone = {
          ...existing,
          ...update,
          path: [...(existing.path || []), [update.latitude, update.longitude]].slice(-100),
          lastUpdated: Date.now()
        };

        // Notify parent component
        if (onDroneUpdate) {
          onDroneUpdate(updatedDrone);
        }

        return {
          ...prev,
          [update.droneId]: updatedDrone
        };
      });
    };

    const handleAlert = (alert) => {
      setDrones(prev => ({
        ...prev,
        [alert.droneId]: {
          ...prev[alert.droneId],
          status: 'alert',
          lastAlert: alert.message
        }
      }));
    };

    onUpdate(handleUpdate);
    onAlert(handleAlert);

    // Cleanup
    return () => {
      onUpdate(() => {});
      onAlert(() => {});
    };
  }, [onUpdate, onAlert, onDroneUpdate]);

  return (
    <>
      {Object.values(drones).map(drone => (
        <div key={drone.id}>
          <DroneMarker 
            drone={drone} 
            isSelected={selectedDrone === drone.id}
          />
          <Polyline
            positions={drone.path}
            color={drone.status === 'alert' ? '#ef4444' : '#3b82f6'}
            weight={1.5}
            opacity={0.7}
          />
        </div>
      ))}
    </>
  );
};

export default DroneTrackingLayer;