const zoneModel = require('../models/zoneModel');

async function checkGeofence(lat, lon) {
  const zone = await zoneModel.findOne({
    geometry: {
      $geoIntersects: {
        $geometry: {
          type: "Point",
          coordinates: [lon, lat]
        }
      }
    }
  });

  return zone ? { 
    zoneType: zone.type,
    message: `Entered ${zone.type} zone at ${lat},${lon}`
  } : null;
}

module.exports = { checkGeofence };