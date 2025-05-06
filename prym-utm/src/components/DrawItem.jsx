import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";

export const DrawControl = ({ onDrawCreated, onDrawEdited, onDrawDeleted }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: "bottomright",
      draw: {
        polygon: true,
        polyline: true,
        rectangle: true,
        circle: true,
        marker: true,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });

    map.addControl(drawControl);

    // Handle when a shape is CREATED
    const handleDrawCreated = (e) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);

      // Extract GeoJSON data
      const geoJSON = layer.toGeoJSON();

      // If it's a circle, extract radius
      if (layer instanceof L.Circle) {
        const center = layer.getLatLng(); // { lat, lng }
        const radius = layer.getRadius(); // in meters

        // Add radius to GeoJSON properties
        geoJSON.properties = {
          ...geoJSON.properties,
          radius: radius,
          center: [center.lng, center.lat], // GeoJSON uses [lng, lat]
        };
      }

      if (onDrawCreated) onDrawCreated(geoJSON);
    };

    // Handle when a shape is EDITED
    const handleDrawEdited = (e) => {
      const layers = e.layers;
      layers.eachLayer((layer) => {
        const geoJSON = layer.toGeoJSON();
        if (onDrawEdited) onDrawEdited(geoJSON);
      });
    };

    // Handle when a shape is DELETED
    const handleDrawDeleted = (e) => {
      const layers = e.layers;
      layers.eachLayer((layer) => {
        const geoJSON = layer.toGeoJSON();
        if (onDrawDeleted) onDrawDeleted(geoJSON);
      });
    };

    // Attach event listeners
    map.on(L.Draw.Event.CREATED, handleDrawCreated);
    map.on("draw:edited", handleDrawEdited);
    map.on("draw:deletestop", handleDrawDeleted);

    // Cleanup
    return () => {
      map.off(L.Draw.Event.CREATED, handleDrawCreated);
      map.off("draw:edited", handleDrawEdited);
      map.off("draw:deletestop", handleDrawDeleted);
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onDrawCreated, onDrawEdited, onDrawDeleted]);

  return null;
};
