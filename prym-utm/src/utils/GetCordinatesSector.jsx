const getSectorPolygon = (
  center,
  innerRadius,
  outerRadius,
  startAzimuth,
  endAzimuth,
  step = 5,
  providedVertices = []
) => {
  const points = [];
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const earthRadius = 6378137; // Earth's radius in meters

  const lat1 = toRadians(center[0]);
  const lng1 = toRadians(center[1]);

  // Normalize azimuth values to [0, 360)
  const normalizeAzimuth = (angle) => ((angle % 360) + 360) % 360;

  const normalizedStartAzimuth = normalizeAzimuth(startAzimuth);
  let normalizedEndAzimuth = normalizeAzimuth(endAzimuth);

  // Default to a full circle if azimuth values are both 0
  if (normalizedStartAzimuth === 0 && normalizedEndAzimuth === 0) {
    normalizedEndAzimuth = 360;
  }

  // Helper function to calculate a point given an azimuth and radius
  const calculatePoint = (bearing, radius) => {
    const bearingRad = toRadians(bearing);
    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(radius / earthRadius) +
        Math.cos(lat1) * Math.sin(radius / earthRadius) * Math.cos(bearingRad)
    );
    const lng2 =
      lng1 +
      Math.atan2(
        Math.sin(bearingRad) * Math.sin(radius / earthRadius) * Math.cos(lat1),
        Math.cos(radius / earthRadius) - Math.sin(lat1) * Math.sin(lat2)
      );
    return [(lat2 * 180) / Math.PI, (lng2 * 180) / Math.PI];
  };

  // Use provided vertices if available
  if (Array.isArray(providedVertices) && providedVertices.length > 0) {
    points.push(...providedVertices);
  }

  // Generate additional points for the outer radius if needed
  const generateAngles = (start, end) => {
    const angles = [];
    for (let angle = start; angle <= end; angle += step) {
      angles.push(angle);
    }
    return angles;
  };

  let angles = [];
  if (normalizedStartAzimuth <= normalizedEndAzimuth) {
    angles = generateAngles(normalizedStartAzimuth, normalizedEndAzimuth);
  } else {
    // Handle azimuth range crossing 360°
    angles = [...generateAngles(normalizedStartAzimuth, 360), ...generateAngles(0, normalizedEndAzimuth)];
  }

  // Add points for the outer radius if not already provided
  if (outerRadius > 0) {
    angles.forEach((angle) => {
      const point = calculatePoint(angle, outerRadius);
      if (!points.some((p) => p[0] === point[0] && p[1] === point[1])) {
        points.push(point); // Avoid duplicates
      }
    });
  }

  // Add points for the inner radius if applicable
  if (innerRadius > 0) {
    angles.reverse().forEach((angle) => {
      const point = calculatePoint(angle, innerRadius);
      if (!points.some((p) => p[0] === point[0] && p[1] === point[1])) {
        points.push(point); // Avoid duplicates
      }
    });
  }

  return points;
};

export default getSectorPolygon;