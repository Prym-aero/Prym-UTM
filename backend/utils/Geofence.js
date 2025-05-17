const Zone = require('../models/Zone');
const turf = require('@turf/turf'); // For advanced geospatial calculations

/**
 * Checks if a point is inside any restricted zone
 * @param {number} lat - Latitude of the point
 * @param {number} lon - Longitude of the point
 * @returns {Promise<Object|null>} Zone violation data or null if clear
 */
async function checkGeofence(lat, lon) {
  const point = { type: 'Point', coordinates: [lon, lat] };
  
  // Get all zones that geometrically contain the point
  const zones = await Zone.find({
    $or: [
      { type: 'circle', center: { $geoWithin: { $centerSphere: [[lon, lat], 0.0001] } } },
      { type: 'polygon', vertices: { $geoIntersects: { $geometry: point } } },
      { type: 'sector', center: { $geoWithin: { $centerSphere: [[lon, lat], 0.0001] } } }
    ]
  });

  if (zones.length === 0) return null;

  // Detailed check for each potential zone
  for (const zone of zones) {
    if (isInZone(zone, lat, lon)) {
      return {
        zoneId: zone._id,
        zoneType: zone.airspace, // Using your 'airspace' field as type
        zoneName: zone.name,
        location: zone.location,
        regulation: zone.regulation
      };
    }
  }

  return null;
}

/**
 * Precise zone containment check
 */
function isInZone(zone, lat, lon) {
  switch (zone.type) {
    case 'circle':
      return checkCircleZone(zone, lat, lon);
    case 'polygon':
      return checkPolygonZone(zone, lat, lon);
    case 'sector':
      return checkSectorZone(zone, lat, lon);
    default:
      return false;
  }
}

// Circle zone check (radius in meters)
function checkCircleZone(zone, lat, lon) {
  const [centerLon, centerLat] = zone.center;
  const distance = turf.distance(
    turf.point([lon, lat]),
    turf.point([centerLon, centerLat]),
    { units: 'meters' }
  );
  return distance <= zone.radius;
}

// Polygon zone check
function checkPolygonZone(zone, lat, lon) {
  const polygon = turf.polygon([zone.vertices]);
  const point = turf.point([lon, lat]);
  return turf.booleanPointInPolygon(point, polygon);
}

// Sector zone check (pie-slice shaped area)
function checkSectorZone(zone, lat, lon) {
  const [centerLon, centerLat] = zone.center;
  const point = [lon, lat];
  
  // 1. Check distance range
  const distance = turf.distance(
    turf.point(point),
    turf.point([centerLon, centerLat]),
    { units: 'meters' }
  );
  
  if (distance < zone.innerRadius || distance > zone.outerRadius) {
    return false;
  }

  // 2. Check azimuth angle
  const bearing = turf.rhumbBearing(
    turf.point([centerLon, centerLat]),
    turf.point(point)
  );
  
  // Normalize angles
  const start = (zone.startAzimuth + 360) % 360;
  const end = (zone.endAzimuth + 360) % 360;
  const pointBearing = (bearing + 360) % 360;

  if (start < end) {
    return pointBearing >= start && pointBearing <= end;
  } else {
    return pointBearing >= start || pointBearing <= end;
  }
}

module.exports = { checkGeofence };