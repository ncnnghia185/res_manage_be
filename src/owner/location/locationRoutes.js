const router = require("express").Router();
const locationControllers = require("./locationControllers");

router.post("/add-location", locationControllers.createNewLocation);
router.get("/all-locations", locationControllers.getAllLocationInfor);
router.get("/infor/:id", locationControllers.getLocationInfor);
router.put("/update/:id", locationControllers.updateLocationInfor);
router.delete("/delete/:id", locationControllers.deleteLocation);

module.exports = router;
