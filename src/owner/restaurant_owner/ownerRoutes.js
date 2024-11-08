// Import package
const router = require("express").Router();
// Import file
const ownerController = require("./ownerControllers");
const { verifyAccessToken } = require("../../../middlewares/verifyToken");

// Routes
router.post("/register-account", ownerController.registerOwnerAccout);
router.post("/login-account", ownerController.loginOwnerAccout);
router.get(
  "/infor/:uId",
  verifyAccessToken,
  ownerController.getRestaurantOwnerInfor
);
module.exports = router;
