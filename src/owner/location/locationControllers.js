const { successResponse, failResponse } = require("../../../utils/apiResponse");
const locationServices = require("./locationServices");

// Create new location
const createNewLocation = async (req, res) => {
  try {
    const newLocation = await locationServices.insertNewLocation(req.body);
    successResponse(res, newLocation);
  } catch (error) {
    failResponse(res, error);
  }
};
// Get one location infor
const getLocationInfor = async (req, res) => {
  try {
    const { id } = req.params;
    const { owner_id, restaurant_id } = req.query;
    const locationInfor = await locationServices.selectOneLocation(
      id,
      owner_id,
      restaurant_id
    );
    successResponse(res, locationInfor);
  } catch (error) {
    failResponse(res, error);
  }
};
// Get all locations
const getAllLocationInfor = async (req, res) => {
  try {
    const { owner_id, restaurant_id } = req.query;
    const allLocations = await locationServices.selectAllLocations(
      owner_id,
      restaurant_id
    );
    successResponse(res, allLocations);
  } catch (error) {
    failResponse(res, error);
  }
};
// Update location infor
const updateLocationInfor = async (req, res) => {
  try {
    const { id } = req.params;
    const { owner_id, restaurant_id } = req.query;
    const updatedLocation = await locationServices.updateOneLocation(
      id,
      req.body?.name,
      owner_id,
      restaurant_id
    );
    successResponse(res, updatedLocation);
  } catch (error) {
    failResponse(res, error);
  }
};
// Delete location
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { owner_id, restaurant_id } = req.query;
    await locationServices.deleteOneLocation(id, owner_id, restaurant_id);
    successResponse(res);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = {
  createNewLocation,
  getLocationInfor,
  getAllLocationInfor,
  updateLocationInfor,
  deleteLocation,
};
