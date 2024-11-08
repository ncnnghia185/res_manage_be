const router = require("express").Router();
const paymentCOntrollers = require("./paymentController");

// Routes
router.post("/add-payment", paymentCOntrollers.createNewPayment);
router.get("/all-payments", paymentCOntrollers.getAllPayments);
router.get("/payment-infor/:pId", paymentCOntrollers.getOnePayment);
module.exports = router;
