const { successResponse, failResponse } = require("../../../utils/apiResponse");
const orderDetailServices = require("./orderDetailServices");

// Create new order details
const createNewOrderDetails = async (req, res) => {
  try {
    const { oId, tId } = req.params;
    const { owner_id, restaurant_id, data } = req.body;
    const newOrderDetails = await orderDetailServices.insertNewOrderDetails(
      oId,
      tId,
      owner_id,
      restaurant_id,
      data
    );
    successResponse(res, newOrderDetails);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get one order details
const getOneOrderDetails = async (req, res) => {
  try {
    const { oId } = req.params;
    const { tId } = req.params;
    const orderDetails = await orderDetailServices.selectOneOrderDetails(
      oId,
      tId
    );
    successResponse(res, orderDetails);
  } catch (error) {
    failResponse(res, error);
  }
};

// Update order details items
const updateOrderDetailItems = async (req, res) => {
  try {
    const updatedOrderDetails =
      await orderDetailServices.updateOrderDetailItems(req.body);
    successResponse(res, updatedOrderDetails);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = {
  createNewOrderDetails,
  getOneOrderDetails,
  updateOrderDetailItems,
};
