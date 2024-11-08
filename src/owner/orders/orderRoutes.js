const router = require("express").Router();
const orderControllers = require("./orderControllers");

router.post("/add-order", orderControllers.createNewOrder);
router.get("/all-orders", orderControllers.getAllOrderInfor);
router.get("/infor/:id", orderControllers.getOrderInfor);
router.delete("/delete/:oId", orderControllers.deleteOrderInfor);
router.put(
  "/change-payment-status/:oId",
  orderControllers.updateOrderPaymentStatus
);
module.exports = router;
