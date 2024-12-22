const router = require("express").Router();
const staffControllers = require("./staffControllers");
const timesheetPaymentControllers = require("./timesheet_payroll/timesheetPayrollControllers");
const monthSalaryControllers = require("./month salary/monthSalaryController");
const { verifyAccessToken } = require("../../../middlewares/verifyToken");
router.post("/add-staff", verifyAccessToken, staffControllers.createNewStaff);
router.get(
  "/all-staffs",
  verifyAccessToken,
  staffControllers.getAllStaffsInfor
);
router.get("/infor/:id", verifyAccessToken, staffControllers.getOneStaffInfor);
router.put(
  "/update/:id",
  verifyAccessToken,
  staffControllers.updateOneStaffInfor
);
router.delete(
  "/delete/:id",
  verifyAccessToken,
  staffControllers.delteOneStaffInfor
);

// Timesheet and Payroll for specific staff
router.post("/daily-work/:sId", timesheetPaymentControllers.createNewDailyWork);
router.get(
  "/time-sheet/:sId",
  timesheetPaymentControllers.getAllStaffTimesheet
);

// Salary by month of staff
router.post("/month-salary/:sId", monthSalaryControllers.staffMonthSalary);
router.get("/detail-paid/:sId", monthSalaryControllers.salaryPaidToEmployees);
module.exports = router;
