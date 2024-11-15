const { successResponse, failResponse } = require("../../../utils/apiResponse");
const tableServices = require("./tablesServices");

// Create new table
const createNewTable = async (req, res) => {
  try {
    const newTable = await tableServices.insertNewTable(req.body);
    successResponse(res, newTable);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get one table infor
const getOneTableInfor = async (req, res) => {
  try {
    const { tId } = req.params;
    const { owner_id, restaurant_id } = req.query;
    const tableInfor = await tableServices.selectOneTable(
      tId,
      owner_id,
      restaurant_id
    );
    successResponse(res, tableInfor);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get all table names
const getAllTableWithoutFilter = async (req, res) => {
  try {
    const { owner_id, restaurant_id } = req.query;
    const allTables = await tableServices.selectAllTableWithoutFilter(
      owner_id,
      restaurant_id
    );
    successResponse(res, allTables);
  } catch (error) {
    failResponse(res, error);
  }
};
// Get all table infor with filter
const getAllTableInfor = async (req, res) => {
  try {
    const allTables = await tableServices.selectAllTables(req.body);
    successResponse(res, allTables);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get order of the table
const getOrderOfTable = async (req, res) => {
  const { tId } = req.params;
  try {
    const orderInfor = await tableServices.selectOrderOfTable(tId);
    successResponse(res, orderInfor);
  } catch (error) {
    failResponse(res, error);
  }
};

// Update table infor
const updateTableInfor = async (req, res) => {
  try {
    const { tId } = req.params;
    const { owner_id, restaurant_id } = req.query;
    const updatedTable = await tableServices.updateOneTable(
      tId,
      req.body,
      owner_id,
      restaurant_id
    );
    successResponse(res, updatedTable);
  } catch (error) {
    failResponse(res, error);
  }
};

// Update table status
const updateTableStatus = async (req, res) => {
  try {
    const { tId } = req.params;
    const updateStatus = await tableServices.updateStatusTable(tId);
    successResponse(res, updateStatus);
  } catch (error) {
    failResponse(res, error);
  }
};

// Delete one table
const deleteTable = async (req, res) => {
  try {
    const { tId } = req.params;
    const { owner_id, restaurant_id } = req.query;
    await tableServices.deleteOneTable(tId, owner_id, restaurant_id);
    successResponse(res);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = {
  createNewTable,
  getOneTableInfor,
  getAllTableWithoutFilter,
  getAllTableInfor,
  getOrderOfTable,
  updateTableInfor,
  updateTableStatus,
  deleteTable,
};
