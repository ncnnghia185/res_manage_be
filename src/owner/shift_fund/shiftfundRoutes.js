const router = require("express").Router();
const shiftfundController = require("./shiftFundController");

// Routes
router.post("/open-shift-fund", shiftfundController.createOpenShiftFund);
router.put("/close-shift-fund/:sId", shiftfundController.updateCloseShiftFund);
router.get("/daily-shift-fund/:date", shiftfundController.getDailyShiftFund);

module.exports = router;
