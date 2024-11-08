const router = require("express").Router();
const tableControllers = require("./tablesControllers");

router.post("/add-table", tableControllers.createNewTable);
router.get("/all-tables", tableControllers.getAllTableInfor);
router.get("/infor/:tId", tableControllers.getOneTableInfor);
router.get("/order-of-table/:tId", tableControllers.getOrderOfTable);
router.put("/update/:tId", tableControllers.updateTableInfor);
router.put("/update-status/:tId", tableControllers.updateTableStatus);
router.delete("/delete/table/:tId", tableControllers.deleteTable);
module.exports = router;
