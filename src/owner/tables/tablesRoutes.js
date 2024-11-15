const router = require("express").Router();
const tableControllers = require("./tablesControllers");
const { verifyAccessToken } = require("../../../middlewares/verifyToken");

router.post("/add-table", verifyAccessToken, tableControllers.createNewTable);
router.get(
  "/all-tables",
  verifyAccessToken,
  tableControllers.getAllTableWithoutFilter
);
router.get(
  "/all-tables-with-filter",
  verifyAccessToken,
  tableControllers.getAllTableInfor
);
router.get("/infor/:tId", verifyAccessToken, tableControllers.getOneTableInfor);
router.get(
  "/order-of-table/:tId",
  verifyAccessToken,
  tableControllers.getOrderOfTable
);
router.put(
  "/update-infor/:tId",
  verifyAccessToken,
  tableControllers.updateTableInfor
);
router.put(
  "/update-status/:tId",
  verifyAccessToken,
  tableControllers.updateTableStatus
);
router.delete(
  "/delete/table/:tId",
  verifyAccessToken,
  tableControllers.deleteTable
);
module.exports = router;
