const router = require("express").Router();
const orderControllers = require("./orderControllers");
const { verifyAccessToken } = require("../../../middlewares/verifyToken");

router.post("/add-order", verifyAccessToken, orderControllers.createNewOrder);
router.get("/all-orders", verifyAccessToken, orderControllers.getAllOrderInfor);
router.get(
  "/serving-order/:tId",
  verifyAccessToken,
  orderControllers.getServingOrderOfTable
);
router.get("/infor/:id", verifyAccessToken, orderControllers.getOrderInfor);
router.delete(
  "/delete/:oId",
  verifyAccessToken,
  orderControllers.deleteOrderInfor
);
router.put(
  "/change-payment-status/:oId",
  orderControllers.updateOrderPaymentStatus
);
module.exports = router;
