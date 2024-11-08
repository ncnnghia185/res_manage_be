const { successResponse, failResponse } = require("../../../utils/apiResponse");
const staffServices = require("./staffServices");

// Create new staff
const createNewStaff = async (req, res) => {
  try {
    const newStaff = await staffServices.insertNewStaff(req.body);
    successResponse(res, newStaff);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get one staff infor
const getOneStaffInfor = async (req, res) => {
  try {
    const { id } = req.params;
    const staffInfor = await staffServices.selectOneStaff(id);
    successResponse(res, staffInfor);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get all staffs infor
const getAllStaffsInfor = async (req, res) => {
  try {
    const allStaffs = await staffServices.selectAllStaffs();
    successResponse(res, allStaffs);
  } catch (error) {
    failResponse(res, error);
  }
};

// Update one staff infor
const updateOneStaffInfor = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStaff = await staffServices.updateOneStaff(id, req.body);
    successResponse(res, updatedStaff);
  } catch (error) {
    failResponse(res, error);
  }
};

// Delete one staff infor
const delteOneStaffInfor = async (req, res) => {
  try {
    const { id } = req.params;
    await staffServices.deleteOneStaff(id);
    successResponse(res);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = {
  createNewStaff,
  getOneStaffInfor,
  getAllStaffsInfor,
  updateOneStaffInfor,
  delteOneStaffInfor,
};
