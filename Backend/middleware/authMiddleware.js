const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // Header se token nikalo
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // "Bearer xyz123..." mein se sirf token wala part nikalo
    const token = authHeader.split(" ")[1];

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Decoded data (id, role) ko request mein daal do, aage use karne ke liye
    req.user = decoded;

    next(); // sab sahi hai, aage badho controller tak
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protect };