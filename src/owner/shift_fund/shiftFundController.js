const { successResponse, failResponse } = require("../../../utils/apiResponse");
const shiftfundServices = require("./shiftfundServices");

// Create open shift fund
const createOpenShiftFund = async (req, res) => {
  try {
    const openShiftFund = await shiftfundServices.insertShiftFundOpen(req.body);
    successResponse(res, openShiftFund);
  } catch (error) {
    failResponse(res, error);
  }
};

// Update close shift fund
const updateCloseShiftFund = async (req, res) => {
  const { sId } = req.params;
  try {
    const closeShiftFund = await shiftfundServices.updateShiftFundEnd(
      req.body,
      sId
    );
    successResponse(res, closeShiftFund);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get daily shift fund
const getDailyShiftFund = async (req, res) => {
  const { date } = req.params;
  try {
    const dailyShiftFund = await shiftfundServices.selectDailyShiftFund(date);
    successResponse(res, dailyShiftFund);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = {
  createOpenShiftFund,
  updateCloseShiftFund,
  getDailyShiftFund,
};
