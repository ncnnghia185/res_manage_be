const {
  successResponse,
  failResponse,
} = require("../../../../utils/apiResponse");
const monthSalaryServices = require("./monthSalaryServices");

// Real staff's month salary
const staffMonthSalary = async (req, res) => {
  try {
    const { sId } = req.params;
    const staffSalary = await monthSalaryServices.calculateRealStaffSalary(
      sId,
      req.body
    );
    successResponse(res, staffSalary);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get salary information for each month of the year paid to employees
const salaryPaidToEmployees = async (req, res) => {
  try {
    const { sId } = req.params;
    const salaryPaid = await monthSalaryServices.selectStaffSalary(sId);
    successResponse(res, salaryPaid);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = { staffMonthSalary, salaryPaidToEmployees };
