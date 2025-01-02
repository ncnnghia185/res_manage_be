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

// Timesheet and Payrolls routes
router.post(
  "/start-daily-work",
  verifyAccessToken,
  timesheetPaymentControllers.createNewDailyWork
);
router.post(
  "/end-daily-work",
  verifyAccessToken,
  timesheetPaymentControllers.createStaffEndWorkTime
);
router.get(
  "/month-payrolls/:mPR/:yPR",
  verifyAccessToken,
  timesheetPaymentControllers.getAllStaffPayrollsByMonth
);

// Salary by month of staff
router.post("/month-salary/:sId", monthSalaryControllers.staffMonthSalary);
router.get("/detail-paid/:sId", monthSalaryControllers.salaryPaidToEmployees);
module.exports = router;
