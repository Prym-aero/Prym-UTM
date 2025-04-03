import axios from "axios";
const API_URL = import.meta.env.VITE_API_ENDPOINT;

export const isTokenExpired = (token) => {
    if (!token || token.split(".").length !== 3) return true; // Ensure it's a valid JWT format
    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode safely
        return payload.exp * 1000 < Date.now(); // Check expiry
    } catch (error) {
        console.error("Invalid token:", error);
        return true; // Treat as expired if decoding fails
    }
};

export const refreshAccessToken = async (navigate) => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null; // No refresh token, user must log in again

    try {
        const response = await axios.post(`${API_URL}/user/refresh`, 
            { refreshToken }, 
            { headers: { "Content-Type": "application/json" } }
        );

        if (response.status !== 200) {
            throw new Error("Failed to refresh token");
        }

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken); // ✅ Store new token
        return accessToken;
    } catch (error) {
        console.error("🚨 Refresh failed:", error.response?.data || error.message);

        if (error.response?.status === 403 || error.response?.status === 401) {
            // If the error is due to an invalid/expired refresh token
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            alert("Session expired, please log in again.");
            navigate('/'); // Redirect to login page
        }

        return null;
    }
};
