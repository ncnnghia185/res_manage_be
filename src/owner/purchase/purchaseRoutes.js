// const router = require("express").Router();
// const purchaseControllers = require("./purchaseControllers");
// const { verifyAccessToken } = require("../../../middlewares/verifyToken");

// router.post(
//   "/add-new",
//   verifyAccessToken,
//   purchaseControllers.createNewPurchase
// );
// // router.get(
// //   "/all-purchases",
// //   verifyAccessToken,
// //   purchaseControllers.getTotalPurchasesByDay
// // );
// router.get(
//   "/all-items",
//   verifyAccessToken,
//   purchaseControllers.getItemsPurchasedByDay
// );
// router.get(
//   "/all-amount",
//   verifyAccessToken,
//   purchaseControllers.getTotalPurchasesByDay
// );
// router.put(
//   "/update/:id",
//   verifyAccessToken,
//   purchaseControllers.updateItemPurchasedByDay
// );
// // router.post("/total-purchase", purchaseControllers.calculateDailyPurchase);
// router.delete(
//   "/delete/:id",
//   verifyAccessToken,
//   purchaseControllers.deleteItemPurchasedByDay
// );

// router.get(
//   "/purchase-summary-by-month",
//   verifyAccessToken,
//   purchaseControllers.getAllPurchasesSummaryByMonth
// );
// router.get(
//   "/purchase-summary-by-date",
//   verifyAccessToken,
//   purchaseControllers.getPurchaseSummaryByDate
// );
// module.exports = router;
