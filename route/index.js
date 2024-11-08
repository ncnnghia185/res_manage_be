const { verifyAccessToken } = require("../middlewares/verifyToken");
const menuRoutes = require("../src/owner/menu/menuRoutes");
const tablesRoutes = require("../src/owner/tables/tablesRoutes");
const locationRoutes = require("../src/owner/location/locationRoutes");
const orderDetailRoutes = require("../src/owner/order_details/orderDetailRoutes");
const ordersRoutes = require("../src/owner/orders/orderRoutes");
const categoryRoutes = require("../src/owner/menu_category/menuCategoryRoutes");
const ownerRoutes = require("../src/owner/restaurant_owner/ownerRoutes");
const restaurantInforRoutes = require("../src/owner/restaurant_infor/inforRoutes");
const purchaseRoutes = require("../src/owner/purchase/purchaseRoutes");
const monthlyExpenseRoutes = require("../src/owner/monthly_expenses/mothlyExpensesRoutes");
const staffRoutes = require("../src/owner/staff/staffRoutes");
const statisticRoutes = require("../src/owner/statistical/statisRoutes");
const paymentRoutes = require("../src/owner/payment/paymentRoutes");
const shiftfundRoutes = require("../src/owner/shift_fund/shiftfundRoutes");

const initWebroute = (app) => {
  app.use("/api/menu", menuRoutes);
  app.use("/api/tables", tablesRoutes);
  app.use("/api/location", locationRoutes);
  app.use("/api/order-details", orderDetailRoutes);
  app.use("/api/orders", ordersRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/owner", ownerRoutes);
  app.use("/api/restaurant", restaurantInforRoutes);
  app.use("/api/purchase", purchaseRoutes);
  app.use("/api/monthly-expenses", monthlyExpenseRoutes);
  app.use("/api/staff", staffRoutes);
  app.use("/api/statistic", statisticRoutes);
  app.use("/api/payment", paymentRoutes);
  app.use("/api/shift-fund", shiftfundRoutes);
};

module.exports = initWebroute;
