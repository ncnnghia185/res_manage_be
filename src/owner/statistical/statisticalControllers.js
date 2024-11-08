const { successResponse, failResponse } = require("../../../utils/apiResponse");
const statisticServices = require("./statisticalServices");

// Calculate profit by day
const calculateProfitByDay = async (req, res) => {
  try {
    const { date } = req.body;
    const profitByDay = await statisticServices.statisticProfitByDay(date);
    successResponse(res, profitByDay);
  } catch (error) {
    failResponse(res, error);
  }
};

// Calculate profit by month
const calculateProfitByMonth = async (req, res) => {
  try {
    const { month } = req.body;
    const profitByMonth = await statisticServices.statisticProfitByMonth(month);
    successResponse(res, profitByMonth);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = {
  calculateProfitByDay,
  calculateProfitByMonth,
};
