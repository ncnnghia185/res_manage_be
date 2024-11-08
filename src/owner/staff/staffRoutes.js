const router = require("express").Router();
const staffControllers = require("./staffControllers");
const timesheetPaymentControllers = require("./timesheet_payroll/timesheetPayrollControllers");
const monthSalaryControllers = require("./month salary/monthSalaryController");
router.post("/add-staff", staffControllers.createNewStaff);
router.get("/all-staffs", staffControllers.getAllStaffsInfor);
router.get("/infor/:id", staffControllers.getOneStaffInfor);
router.put("/update/:id", staffControllers.updateOneStaffInfor);
router.delete("/delete/:id", staffControllers.delteOneStaffInfor);

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
