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
  const { owner_id, restaurant_id } = req.query;
  try {
    const closeShiftFund = await shiftfundServices.updateShiftFundEnd(
      req.body,
      sId,
      owner_id,
      restaurant_id
    );
    successResponse(res, closeShiftFund);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get daily shift fund
const getDailyShiftFund = async (req, res) => {
  const { date } = req.params;
  const { owner_id, restaurant_id } = req.query;
  try {
    const dailyShiftFund = await shiftfundServices.selectDailyShiftFund(
      date,
      owner_id,
      restaurant_id
    );
    successResponse(res, dailyShiftFund);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get detail shift fund by id
const getDetailShiftFundById = async (req, res) => {
  try {
    const { sId } = req.params;
    const { owner_id, restaurant_id } = req.query;
    const detailShiftFund = await shiftfundServices.selectDailyShiftFundById(
      sId,
      owner_id,
      restaurant_id
    );
    successResponse(res, detailShiftFund);
  } catch (error) {
    failResponse(res, error);
  }
};

// Update notes for shift fund
const updateNotesShiftFund = async (req, res) => {
  const { sId } = req.params;
  const { owner_id, restaurant_id } = req.query;
  try {
    const updatedNotes = await shiftfundServices.updateShiftFundNotes(
      req.body,
      sId,
      owner_id,
      restaurant_id
    );
    successResponse(res, updatedNotes);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = {
  createOpenShiftFund,
  updateCloseShiftFund,
  getDailyShiftFund,
  updateNotesShiftFund,
  getDetailShiftFundById,
};
