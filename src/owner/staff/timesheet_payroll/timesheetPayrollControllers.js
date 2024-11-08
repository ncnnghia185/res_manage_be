const {
  successResponse,
  failResponse,
} = require("../../../../utils/apiResponse");
const timesheetPayrollServices = require("./timesheetPayrollServices");

// Create staff's daily work infor
const createNewDailyWork = async (req, res) => {
  try {
    const { sId } = req.params;

    const newDailyWork =
      await timesheetPayrollServices.insertBasicPayrollAndTimeSheet(
        sId,

        req.body
      );
    successResponse(res, newDailyWork);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get all staff's timesheet infor
const getAllStaffTimesheet = async (req, res) => {
  try {
    const { sId } = req.params;
    const { dateString } = req.query;
    const staffTimesheet =
      await timesheetPayrollServices.selectAllStaffTimesheets(sId, dateString);
    successResponse(res, staffTimesheet);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = {
  createNewDailyWork,
  getAllStaffTimesheet,
};
