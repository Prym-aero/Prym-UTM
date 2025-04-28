export const isValidLatLng = (point) => {
    // Check if the point is a valid latitude/longitude pair
    if (
      !Array.isArray(point) ||
      point.length !== 2 ||
      typeof point[0] !== "number" ||
      typeof point[1] !== "number"
    ) {
      
      return false;
    }
  
    // Validate latitude range (-90 to 90)
    if (point[0] < -90 || point[0] > 90) {
      
      return false;
    }
  
    // Validate longitude range (-180 to 180)
    if (point[1] < -180 || point[1] > 180) {
      
      return false;
    }
  
    return true; // Valid latitude/longitude
  };
  
  export const isValidPolygon = (vertices, name) => {
    // Check if vertices is an array with at least 3 points
    if (!Array.isArray(vertices) || vertices.length < 3) {
     
      return false;
    }
  
    // Validate each vertex
    for (let i = 0; i < vertices.length; i++) {
      const current = vertices[i];
      const next = vertices[(i + 1) % vertices.length]; // Wrap around to check closure
  
      // Check if the current vertex is valid
      if (!isValidLatLng(current)) {
        
        return false;
      }
  
    //   // Check for duplicate consecutive points
    //   if (i > 0 && current[0] === next[0] && current[1] === next[1]) {
    //     console.warn(
    //       `Duplicate consecutive points in polygon:${name} ${JSON.stringify(current)}. Skipping polygon.`
    //     );
    //     return false;
    //   }
    }
  
    // Check if the polygon is closed
    const firstVertex = vertices[0];
    const lastVertex = vertices[vertices.length - 1];
    if (firstVertex[0] !== lastVertex[0] || firstVertex[1] !== lastVertex[1]) {
      
      return false; // Polygon is invalid because it's not closed
    }
  
    return true; // Polygon is valid and closed
  };