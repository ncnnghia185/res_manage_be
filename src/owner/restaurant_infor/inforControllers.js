const { successResponse, failResponse } = require("../../../utils/apiResponse");
const inforServices = require("./inforServices");

// create new restaurant infor
const createNewRestaurantInfor = async (req, res) => {
  try {
    const { id } = req.user;
    const newInfor = await inforServices.insertNewRestaurantInfor(req.body, id);
    successResponse(res, newInfor);
  } catch (error) {
    failResponse(res, error);
  }
};

// select list restaurant name
const listRestaurantNames = async (req, res) => {
  try {
    const { id } = req.params;
    const listNames = await inforServices.selectRestaurantName(id);
    successResponse(res, listNames);
  } catch (error) {
    failResponse(res, error);
  }
};

// Select one restaurant name
const selectOneRestaurantName = async (req, res) => {
  const { rId } = req.params;
  try {
    const resName = await inforServices.selectOneRestaurantName(rId);
    successResponse(res, resName);
  } catch (error) {
    failResponse(res, error);
  }
};

// Select restaurant information
const selectRestaurantInfor = async (req, res) => {
  try {
    const { uid } = req.params;
    const { rid } = req.params;
    const resInfor = await inforServices.selectRestaurantInfor(uid, rid);
    successResponse(res, resInfor);
  } catch (error) {
    failResponse(res, error);
  }
};

// Update restaurant information
const updateRestaurantInfor = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInfor = await inforServices.updateOneRestaurant(id, req.body);
    successResponse(res, updatedInfor);
  } catch (error) {
    failResponse(res, error);
  }
};

// Delete restaurant
const deleteRestaurantInfor = async (req, res) => {
  try {
    const { id } = req.params;
    await inforServices.deleteOneRestaurant(id);
    successResponse(res);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = {
  createNewRestaurantInfor,
  listRestaurantNames,
  selectRestaurantInfor,
  selectOneRestaurantName,
  updateRestaurantInfor,
  deleteRestaurantInfor,
};
