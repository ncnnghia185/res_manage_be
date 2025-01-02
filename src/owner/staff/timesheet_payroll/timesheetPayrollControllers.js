const {
  successResponse,
  failResponse,
} = require("../../../../utils/apiResponse");
const timesheetPayrollServices = require("./timesheetPayrollServices");

// Create staff's daily work infor
const createNewDailyWork = async (req, res) => {
  try {
    const { owner_id, restaurant_id } = req.query;
    const newDailyWork = await timesheetPayrollServices.insertStartWorkTime(
      req.body,
      owner_id,
      restaurant_id
    );
    successResponse(res, newDailyWork);
  } catch (error) {
    failResponse(res, error);
  }
};

// staff daily end work time
const createStaffEndWorkTime = async (req, res) => {
  try {
    const { shift_id, staff_id, owner_id, restaurant_id } = req.query;
    const endWorkTime = await timesheetPayrollServices.updateEndWorkTime(
      shift_id,
      staff_id,
      owner_id,
      restaurant_id,
      req.body
    );
    successResponse(res, endWorkTime);
  } catch (error) {
    failResponse(res, error);
  }
};
// Get all staff's timesheet infor
const getAllStaffPayrollsByMonth = async (req, res) => {
  try {
    const { mPR, yPR } = req.params;
    const { owner_id, restaurant_id } = req.query;
    const staffTimesheet =
      await timesheetPayrollServices.selectAllStaffsPayrollsByMonth(
        mPR,
        yPR,
        owner_id,
        restaurant_id
      );
    successResponse(res, staffTimesheet);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = {
  createNewDailyWork,
  createStaffEndWorkTime,
  getAllStaffPayrollsByMonth,
};
