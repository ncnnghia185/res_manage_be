const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, phoneNumber) => {
  return jwt.sign(
    { id: userId, phone: phoneNumber },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
