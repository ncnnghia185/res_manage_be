const { successResponse, failResponse } = require("../../../utils/apiResponse");
const paymentServices = require("./paymentServices");

// Create new payment
const createNewPayment = async (req, res) => {
  try {
    const newPayment = await paymentServices.insertPayment(req.body);
    successResponse(res, newPayment);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get all payments
const getAllPayments = async (req, res) => {
  try {
    const allPayments = await paymentServices.selectAllPayments();
    successResponse(res, allPayments);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get one payment
const getOnePayment = async (req, res) => {
  const { pId } = req.params;
  try {
    const payment = await paymentServices.selectOnePayment(pId);
    successResponse(res, payment);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = {
  createNewPayment,
  getAllPayments,
  getOnePayment,
};
