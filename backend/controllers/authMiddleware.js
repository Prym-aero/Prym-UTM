const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log("⛔ No token provided");
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        console.log("📩 Received Token:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", decoded);

        if (!decoded.userId) {
            console.error("🚨 Token is missing userId");
            return res.status(403).json({ message: "Invalid token payload" });
        }

        req.user = { userId: decoded.userId };
        next();
    } catch (error) {
        console.error("🚨 JWT verification failed:", error.message);
        return res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
