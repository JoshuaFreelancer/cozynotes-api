const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // I expect the frontend to send the token in the Authorization header as "Bearer <token>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verifying the token using the secret key I defined in my .env file
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Injecting the decrypted user payload into the request so my controllers can use it
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = authenticateToken;
