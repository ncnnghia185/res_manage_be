const { successResponse, failResponse } = require("../../../utils/apiResponse");
const orderServices = require("./orderServices");

// Create new order
const createNewOrder = async (req, res) => {
  try {
    const newOrderId = await orderServices.insertNewOrder(req.body);
    successResponse(res, newOrderId);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get order infor
const getOrderInfor = async (req, res) => {
  try {
    const { id } = req.params;
    const { owner_id, restaurant_id } = req.query;
    const orderInfor = await orderServices.selectOneOrderInfor(
      id,
      owner_id,
      restaurant_id
    );
    successResponse(res, orderInfor);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get all orders infor
const getAllOrderInfor = async (req, res) => {
  try {
    const allOrdersInfor = await orderServices.selectAllOrdersInfor(req.body);
    successResponse(res, allOrdersInfor);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get serving order of table
const getServingOrderOfTable = async (req, res) => {
  try {
    const { tId } = req.params;
    const { owner_id, restaurant_id } = req.query;
    const servingOrder = await orderServices.selectServingOrderOfTable(
      tId,
      owner_id,
      restaurant_id
    );
    successResponse(res, servingOrder);
  } catch (error) {
    failResponse(res, error);
  }
};
// Update payment status of order
const updateOrderPaymentStatus = async (req, res) => {
  try {
    const { oId } = req.params;
    const updatedPayment = await orderServices.updateOneOrderPaymentStatus(
      oId,
      req.body
    );
    successResponse(res, updatedPayment);
  } catch (error) {
    failResponse(res, error);
  }
};
// Delete one order infor
const deleteOrderInfor = async (req, res) => {
  try {
    const { oId } = req.params;
    await orderServices.deleteOneOrderInfor(oId);
    successResponse(res);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = {
  createNewOrder,
  getOrderInfor,
  getAllOrderInfor,
  deleteOrderInfor,
  updateOrderPaymentStatus,
  getServingOrderOfTable,
};
