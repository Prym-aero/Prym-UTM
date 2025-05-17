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
        square: true,
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

      // Process coordinates based on shape type
      if (layer instanceof L.Circle) {
        const center = layer.getLatLng();
        const radius = layer.getRadius();

        geoJSON.properties = {
          ...geoJSON.properties,
          radius: radius,
          center: [
            parseFloat(center.lng.toFixed(6)),
            parseFloat(center.lat.toFixed(6)),
          ],
        };
      } else if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
        // Process polygon/line coordinates
        geoJSON.geometry.coordinates = geoJSON.geometry.coordinates.map(
          (ring) =>
            ring.map((coord) => [
              parseFloat(coord[0].toFixed(6)),
              parseFloat(coord[1].toFixed(6)),
            ])
        );
      } else if (layer instanceof L.Marker) {
        // Process marker point
        geoJSON.geometry.coordinates = [
          parseFloat(geoJSON.geometry.coordinates[0].toFixed(6)),
          parseFloat(geoJSON.geometry.coordinates[1].toFixed(6)),
        ];
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
