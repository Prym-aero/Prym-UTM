import axios from "axios";

export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT safely
        return payload.exp * 1000 < Date.now(); // Check if expired
    } catch (error) {
        console.error("Invalid token:", error);
        return true; // Treat as expired if decoding fails
    }
};

export const refreshAccessToken = async (navigate) => { // Accept navigate as a parameter
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null; // No refresh token, user must log in again

    try {
        const response = await axios.post("http://localhost:3000/api/user/refresh", 
            { refreshToken }, 
            { headers: { "Content-Type": "application/json" } }
        );

        if (response.status !== 200) {
            throw new Error("Failed to refresh token");
        }

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken); // Store new token
        return accessToken;
    } catch (error) {
        console.error("Refresh failed:", error.response?.data || error.message);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        alert("Session expired, please log in again.");
        navigate('/'); // Redirect to login page
        return null;
    }
};
