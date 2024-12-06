const router = require("express").Router();
const orderDetailControllers = require("./orderDetailControllers");
const { verifyAccessToken } = require("../../../middlewares/verifyToken");
router.post(
  "/add-order-details/:oId/:tId",
  verifyAccessToken,
  orderDetailControllers.createNewOrderDetails
);
router.get("/infor/:oId/:tId", orderDetailControllers.getOneOrderDetails);
router.put("/add-items", orderDetailControllers.updateOrderDetailItems);
module.exports = router;
