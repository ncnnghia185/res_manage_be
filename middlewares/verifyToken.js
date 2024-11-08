const jwt = require("jsonwebtoken");

// Authentication
const verifyAccessToken = async (req, res, next) => {
  try {
    if (req?.headers?.authorization?.startsWith("Bearer")) {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: "Invalid Token",
          });
        }
        req.user = decode;
        next();
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Required Authentication",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  verifyAccessToken,
};
