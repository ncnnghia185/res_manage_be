const router = require("express").Router();
const { verifyAccessToken } = require("../../../middlewares/verifyToken");
const inforControllers = require("./inforControllers");

router.post(
  "/add-infor",
  verifyAccessToken,
  inforControllers.createNewRestaurantInfor
);
router.get("/all-restaurant-name/:id", inforControllers.listRestaurantNames);
router.get(
  "/restaurant-infor/:rId",
  verifyAccessToken,
  inforControllers.selectOneRestaurantName
);
router.get(
  "/infor/:rid",

  inforControllers.selectRestaurantInfor
);
router.put("/update/:id", inforControllers.updateRestaurantInfor);
router.delete("/delete/:id", inforControllers.deleteRestaurantInfor);
module.exports = router;
