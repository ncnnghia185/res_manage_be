const router = require("express").Router();
const purchaseControllers = require("./purchaseControllers");

router.post("/add-new", purchaseControllers.createNewPurchase);
router.get("/all-purchases", purchaseControllers.getTotalPurchasesByDay);
router.get("all-items/:date", purchaseControllers.getItemsPurchasedByDay);
router.get("all-amount/:date", purchaseControllers.getTotalPurchasesByDay);
router.put("/update/:id", purchaseControllers.updateItemPurchasedByDay);
// router.post("/total-purchase", purchaseControllers.calculateDailyPurchase);
router.delete("/delete/:id", purchaseControllers.deleteItemPurchasedByDay);
module.exports = router;
