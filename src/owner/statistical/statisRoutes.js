const router = require("express").Router();
const statisticControllers = require("./statisticalControllers");

router.post("/profit-by-day", statisticControllers.calculateProfitByDay);
router.post("/profit-by-month", statisticControllers.calculateProfitByMonth);
module.exports = router;
