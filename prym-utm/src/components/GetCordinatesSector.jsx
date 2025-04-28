const getSectorPolygon = (
  center,
  innerRadius,
  outerRadius,
  startAzimuth,
  endAzimuth,
  step = 5
) => {
  const points = [];
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const earthRadius = 6378137;

  const lat1 = toRadians(center[0]);
  const lng1 = toRadians(center[1]);

  // Normalize azimuths to [0, 360)
  const normalizeAzimuth = (angle) => ((angle % 360) + 360) % 360;
  startAzimuth = normalizeAzimuth(startAzimuth);
  endAzimuth = normalizeAzimuth(endAzimuth);

  // Generate azimuth angles
  const angles = [];
  if (startAzimuth <= endAzimuth) {
    for (let angle = startAzimuth; angle <= endAzimuth; angle += step) {
      angles.push(angle);
    }
  } else {
    for (let angle = startAzimuth; angle < 360; angle += step) {
      angles.push(angle);
    }
    for (let angle = 0; angle <= endAzimuth; angle += step) {
      angles.push(angle);
    }
  }

  // Generate points for the outer radius
  angles.forEach((angle) => {
    const bearing = toRadians(angle);
    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(outerRadius / earthRadius) +
        Math.cos(lat1) * Math.sin(outerRadius / earthRadius) * Math.cos(bearing)
    );
    const lng2 =
      lng1 +
      Math.atan2(
        Math.sin(bearing) *
          Math.sin(outerRadius / earthRadius) *
          Math.cos(lat1),
        Math.cos(outerRadius / earthRadius) - Math.sin(lat1) * Math.sin(lat2)
      );
    points.push([(lat2 * 180) / Math.PI, (lng2 * 180) / Math.PI]);
  });

  // Generate points for the inner radius (if applicable)
  if (innerRadius > 0) {
    angles.reverse().forEach((angle) => {
      const bearing = toRadians(angle);
      const lat2 = Math.asin(
        Math.sin(lat1) * Math.cos(innerRadius / earthRadius) +
          Math.cos(lat1) *
            Math.sin(innerRadius / earthRadius) *
            Math.cos(bearing)
      );
      const lng2 =
        lng1 +
        Math.atan2(
          Math.sin(bearing) *
            Math.sin(innerRadius / earthRadius) *
            Math.cos(lat1),
          Math.cos(innerRadius / earthRadius) - Math.sin(lat1) * Math.sin(lat2)
        );
      points.push([(lat2 * 180) / Math.PI, (lng2 * 180) / Math.PI]);
    });
  }

  return points;
};


export default getSectorPolygon;
