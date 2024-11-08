const router = require("express").Router();
const { verifyAccessToken } = require("../../../middlewares/verifyToken");
const inforControllers = require("./inforControllers");

router.post(
  "/add-infor",
  verifyAccessToken,
  inforControllers.createNewRestaurantInfor
);
router.get("/restaurant-name/:id", inforControllers.listRestaurantNames);
router.get("/restaurant-infor/:rId", inforControllers.selectOneRestaurantName);
router.get(
  "/infor/:uid/:rid",

  inforControllers.selectRestaurantInfor
);
router.put("/update/:id", inforControllers.updateRestaurantInfor);
router.delete("/delete/:id", inforControllers.deleteRestaurantInfor);
module.exports = router;
