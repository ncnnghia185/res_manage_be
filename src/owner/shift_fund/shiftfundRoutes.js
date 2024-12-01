const router = require("express").Router();
const shiftfundController = require("./shiftFundController");
const { verifyAccessToken } = require("../../../middlewares/verifyToken");
// Routes
router.post(
  "/open-shift-fund",
  verifyAccessToken,
  shiftfundController.createOpenShiftFund
);
router.put(
  "/close-shift-fund/:sId",
  verifyAccessToken,
  shiftfundController.updateCloseShiftFund
);
router.get(
  "/daily-shift-fund/:date",
  verifyAccessToken,
  shiftfundController.getDailyShiftFund
);
router.get(
  "/detail-shift-fund/:sId",
  verifyAccessToken,
  shiftfundController.getDetailShiftFundById
);
router.put(
  "/update-notes/:sId",
  verifyAccessToken,
  shiftfundController.updateNotesShiftFund
);

module.exports = router;
