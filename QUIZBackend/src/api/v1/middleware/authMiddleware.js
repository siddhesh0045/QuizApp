 const jwt = require("jsonwebtoken");
 const User = require("../../../../models/User");

//httponly
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // read HttpOnly cookie
  



  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(" Token decoded:", decoded);

    next();
  } catch (err) {
      console.log("Error from authMiddlware", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;