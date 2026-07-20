const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify( token,process.env.ACCESS_TOKEN_SECRET );
        console.log("Decoded Token:", decoded);

        req.user = { id: decoded.id, role: decoded.role };
        console.log("Decoded user:", req.user);
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};


module.exports = { authenticate };