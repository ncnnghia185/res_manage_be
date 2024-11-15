const router = require("express").Router();
const locationControllers = require("./locationControllers");
const { verifyAccessToken } = require("../../../middlewares/verifyToken");
router.post(
  "/add-location",
  verifyAccessToken,
  locationControllers.createNewLocation
);
router.get(
  "/all-locations",
  verifyAccessToken,
  locationControllers.getAllLocationInfor
);
router.get(
  "/infor/:id",
  verifyAccessToken,
  locationControllers.getLocationInfor
);
router.put(
  "/update/:id",
  verifyAccessToken,
  locationControllers.updateLocationInfor
);
router.delete(
  "/delete/:id",
  verifyAccessToken,
  locationControllers.deleteLocation
);

module.exports = router;
