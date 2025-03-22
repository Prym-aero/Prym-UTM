export const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT
    return payload.exp * 1000 < Date.now();
};

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null; // No refresh token, user must log in again

    try {
        const response = await fetch("http://localhost:5000/api/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            throw new Error("Refresh token expired, please log in again");
        }

        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken); // Store new token
        return data.accessToken;
    } catch (error) {
        console.error("Refresh failed:", error.message);
        localStorage.clear(); // Clear tokens
        alert("Session expired, please log in again.");
        window.location.href = "/login"; // Redirect to login page
        return null;
    }
};
