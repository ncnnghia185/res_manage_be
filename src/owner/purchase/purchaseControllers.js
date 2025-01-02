// const { successResponse, failResponse } = require("../../../utils/apiResponse");
// const purchaseServices = require("./purchaseServices");

// // Create new purchase
// const createNewPurchase = async (req, res) => {
//   try {
//     const newPurchase = await purchaseServices.insertNewPurchase(req.body);
//     successResponse(res, newPurchase);
//   } catch (error) {
//     failResponse(res, error);
//   }
// };

// // Get total purchase by day
// const getTotalPurchasesByDay = async (req, res) => {
//   const { date } = req.query;
//   try {
//     const totalByDay = await purchaseServices.selectTotalPricePurchasesByDate(
//       date
//     );
//     successResponse(res, totalByDay);
//   } catch (error) {
//     failResponse(res, error);
//   }
// };

// // Get item purchased by day
// const getItemsPurchasedByDay = async (req, res) => {
//   try {
//     const { date, owner_id, restaurant_id } = req.query;
//     const itemsPurchased = await purchaseServices.selectItemsPurchasedByDay(
//       date,
//       owner_id,
//       restaurant_id
//     );
//     successResponse(res, itemsPurchased);
//   } catch (error) {
//     failResponse(res, error);
//   }
// };

// // Calculate total daily purchase
// // const calculateDailyPurchase = async (req, res) => {
// //   try {
// //     const { date } = req.body;
// //     const totalAmount = await purchaseServices.calculateTotalDailyPurchase(
// //       date
// //     );
// //     successResponse(res, totalAmount);
// //   } catch (error) {
// //     failResponse(res, error);
// //   }
// // };

// // Update item purchased by day
// const updateItemPurchasedByDay = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedItem = await purchaseServices.updateItems(id, req.body);
//     successResponse(res, updatedItem);
//   } catch (error) {
//     failResponse(res, error);
//   }
// };

// // Delete item purchased by day
// const deleteItemPurchasedByDay = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { owner_id, restaurant_id } = req.query;
//     await purchaseServices.deleteItems(id, owner_id, restaurant_id);
//     successResponse(res);
//   } catch (error) {
//     failResponse(res, error);
//   }
// };

// // Get all purchases summary by month
// const getAllPurchasesSummaryByMonth = async (req, res) => {
//   try {
//     const { month, year, owner_id, restaurant_id } = req.query;
//     const purchasesSummary =
//       await purchaseServices.selectAllPurchaseSummaryByMonth(
//         month,
//         year,
//         owner_id,
//         restaurant_id
//       );
//     successResponse(res, purchasesSummary);
//   } catch (error) {
//     failResponse(res, error);
//   }
// };

// // Get purchase summary by date
// const getPurchaseSummaryByDate = async (req, res) => {
//   try {
//     const { date, owner_id, restaurant_id } = req.query;
//     const purchaseSummary = await purchaseServices.selectPurchaseSummaryByDate(
//       date,
//       owner_id,
//       restaurant_id
//     );
//     successResponse(res, purchaseSummary);
//   } catch (error) {
//     failResponse(res, error);
//   }
// };
// module.exports = {
//   createNewPurchase,
//   getTotalPurchasesByDay,
//   getItemsPurchasedByDay,
//   updateItemPurchasedByDay,
//   deleteItemPurchasedByDay,
//   getAllPurchasesSummaryByMonth,
//   getPurchaseSummaryByDate,
//   // calculateDailyPurchase,
// };
