const jwt = require("jsonwebtoken");
const User = require("../../../../models/User.js")

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.tokenAdmin;
     
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin access denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = authenticateAdmin;
