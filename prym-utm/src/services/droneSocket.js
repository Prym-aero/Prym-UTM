import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

const useDroneSocket = () => {
  const [socket, setSocket] = useState(null);
  const [activeDrones, setActiveDrones] = useState(new Set());

  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_API_ENDPOINT, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      autoConnect: false
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const connect = () => {
    if (socket) socket.connect();
  };

  const disconnect = () => {
    if (socket) socket.disconnect();
  };

  // Subscribe to drone updates by joining the room 'drone-{droneId}'
  const subscribe = (droneId) => {
    if (socket && !activeDrones.has(droneId)) {
      socket.emit('track-drone', droneId);  // matches backend 'track-drone' event
      setActiveDrones(prev => new Set(prev).add(droneId));
    }
  };

  // Unsubscribe from drone updates (optional: you may want to implement 'untrack-drone' on backend)
  const unsubscribe = (droneId) => {
    if (socket && activeDrones.has(droneId)) {
      // No backend handler shown for unsubscribe, but you can emit a custom event if implemented
      // socket.emit('untrack-drone', droneId);
      setActiveDrones(prev => {
        const updated = new Set(prev);
        updated.delete(droneId);
        return updated;
      });
    }
  };

  // Listen for drone updates from backend 'update' event
  const onUpdate = (callback) => {
    if (socket) {
      socket.off('update'); // remove previous listeners to avoid duplicates
      socket.on('update', callback);
    }
  };

  // Listen for alerts from backend
  const onAlert = (callback) => {
    if (socket) {
      socket.off('alert');
      socket.on('alert', callback);
    }
  };

  // Listen for priority alerts sent specifically to drone operators
  const onPriorityAlert = (callback) => {
    if (socket) {
      socket.off('priority-alert');
      socket.on('priority-alert', callback);
    }
  };

  // Optionally listen for initial drone state
  const onInitialState = (callback) => {
    if (socket) {
      socket.off('initial-state');
      socket.on('initial-state', callback);
    }
  };

  return {
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    onUpdate,
    onAlert,
    onPriorityAlert,
    onInitialState,
    activeDrones: Array.from(activeDrones)
  };
};

export default useDroneSocket;
