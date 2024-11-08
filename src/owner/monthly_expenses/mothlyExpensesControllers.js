const { failResponse, successResponse } = require("../../../utils/apiResponse");
const monthlyExpenseServices = require("./mothlyExpensesServices");

// Create new monthly expense
const createNewMonthlyExpense = async (req, res) => {
  try {
    const newMonthlyExpense = await monthlyExpenseServices.insertNewExpense(
      req.body
    );
    successResponse(res, newMonthlyExpense);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get one monthly expense infor
const getMonthlyExpenseInfor = async (req, res) => {
  try {
    const { id } = req.params;
    const monthlyExpenseInfor = await monthlyExpenseServices.selectOneExpense(
      id
    );
    successResponse(res, monthlyExpenseInfor);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get all monthly expense infor
const getAllMonthlyExpenseInfor = async (req, res) => {
  try {
    const allMonthlyExpenseInfor =
      await monthlyExpenseServices.selectAllExpenses();
    successResponse(res, allMonthlyExpenseInfor);
  } catch (error) {
    failResponse(res, error);
  }
};

// Update one monthly expense infor
const updateMonthlyExpenseInfor = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMonthlyExpense = await monthlyExpenseServices.updateOneExpense(
      id,
      req.body
    );
    successResponse(res, updatedMonthlyExpense);
  } catch (error) {
    failResponse(res, error);
  }
};

// Delete one monthly expense infor
const deleleMonthlyExpenseInfor = async (req, res) => {
  try {
    const { id } = req.params;
    await monthlyExpenseServices.deleteOneExpense(id);
    successResponse(res);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = {
  createNewMonthlyExpense,
  getMonthlyExpenseInfor,
  getAllMonthlyExpenseInfor,
  updateMonthlyExpenseInfor,
  deleleMonthlyExpenseInfor,
};
