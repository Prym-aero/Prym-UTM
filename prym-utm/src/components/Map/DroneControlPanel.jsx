import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useDroneSocket from './useDroneSocket';

const DroneControlPanel = ({ drones, selectedDrone, onSelectDrone }) => {
  const { onPriorityAlert } = useDroneSocket();

  useEffect(() => {
    const handlePriorityAlert = (alert) => {
      toast.error(`PRIORITY ALERT: ${alert.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };

    onPriorityAlert(handlePriorityAlert);

    return () => {
      onPriorityAlert(() => {});
    };
  }, [onPriorityAlert]);

  return (
    <div className="absolute top-20 right-4 bg-white p-4 rounded-lg shadow-xl z-[1000] w-64">
      <h3 className="font-bold text-lg mb-3 border-b pb-2">Active Drones ({Object.keys(drones).length})</h3>
      <div className="max-h-96 overflow-y-auto">
        {Object.values(drones).map(drone => (
          <div 
            key={drone.id}
            className={`p-2 mb-2 rounded cursor-pointer hover:bg-gray-100 transition-colors ${
              selectedDrone === drone.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            } ${
              drone.status === 'alert' ? 'bg-red-50' : ''
            }`}
            onClick={() => onSelectDrone(drone.id)}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{drone.id}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                drone.status === 'active' ? 'bg-green-100 text-green-800' : 
                drone.status === 'alert' ? 'bg-red-100 text-red-800' : 'bg-gray-100'
              }`}>
                {drone.status}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1 flex justify-between">
              <span>Alt: {drone.altitude}m</span>
              <span className={drone.battery < 20 ? 'text-red-500 font-medium' : ''}>
                {drone.battery}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DroneControlPanel;