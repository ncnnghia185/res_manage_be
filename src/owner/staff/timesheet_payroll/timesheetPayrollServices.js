const { updateQuery } = require("../../../../utils/handleQuery");
const { client } = require("../../../../config/dbConfig");
const {
  validateStaffPayrollAndTimeSheet,
} = require("../../../../utils/validateData");

const {
  calculateWorkTime,
  calculateActualWorkHours,
} = require("../../../../utils/calculateWorkTime");

const extractMonthYear = (dateStr) => {
  const [monthStr, yearStr] = dateStr.split("/");
  const month = parseInt(monthStr.replace("Tháng ", ""));
  const year = parseInt(yearStr);
  return { month, year };
};

// INSERT BASIC STAFF PAYROLL AND TIMESHEET INFOR
const insertBasicPayrollAndTimeSheet = async (staffId, data) => {
  const value = validateStaffPayrollAndTimeSheet(data);
  const staff_id = parseInt(staffId);
  const id = parseInt(value.id);
  const require_hours_work_perday = 10;

  let daily_salary = 270000;
  let workdays = 1;
  let notes = "";
  // Check in time without checkout time
  if (!value?.checkout) {
    const checkinInfor = await client.query(
      `INSERT INTO staff_timesheet_payroll(staff_id, work_date, checkin)
      VALUES ($1, $2, $3) RETURNING work_date, checkin
      `,
      [staff_id, value.work_date, value.checkin]
    );
    return checkinInfor.rows[0];
  }

  // With check out time
  // Calculate checkout - checkin time

  let work_hours = calculateWorkTime(value.checkin, value.checkout);
  const [actualWorkHours, actualWorkMinutes] = work_hours
    .split(":")
    .map(Number);

  // Calculate actual work hours by minus 1h30 lunch break
  const totalActualWorkHours =
    actualWorkHours + actualWorkMinutes / 60 - (1 + 30 / 60);

  // Actual work hours of the day

  let actual_work_hours = 0;
  if (totalActualWorkHours < 0) {
    actual_work_hours = 0;
  } else {
    actual_work_hours = calculateActualWorkHours(totalActualWorkHours);
  }

  // Calculate workdays and daily salary by compare with require work hours per day
  if (totalActualWorkHours >= require_hours_work_perday) {
    workdays = 1;
    daily_salary = 270000;
    notes = "Đủ một ngày công";
  } else {
    workdays = totalActualWorkHours / require_hours_work_perday;
    daily_salary = 270000 * workdays;
    notes = "Không đủ một ngày công";
  }

  // Absent work day
  if (value.checkin === "0:00" && value.checkout === "0:00") {
    (workdays = 0),
      (daily_salary = 0),
      (notes = "Nghỉ làm"),
      (actual_work_hours = 0);
  }
  const query_id = await client.query(
    `SELECT id FROM staff_timesheet_payroll WHERE staff_id = $1 AND work_date = $2`,
    [staffId, value.work_date]
  );

  const checkin_id = query_id.rows[0]?.id;
  const result = await client.query(
    `UPDATE  staff_timesheet_payroll 
    SET staff_id = $1, 
        work_date = $2,
        actual_work_hours = $3, 
        notes = $4,
        daily_salary = $5, 
        checkin = $6,
        checkout = $7, 
        workdays = $8
    WHERE id = $9 AND staff_id = $10 AND work_date = $11 RETURNING *`,
    [
      staff_id,
      value.work_date,
      actual_work_hours,
      notes,
      daily_salary,
      value.checkin,
      value.checkout,
      workdays,
      checkin_id,
      staff_id,
      value.work_date,
    ]
  );
  return result.rows[0];
};

// SELECT ALL STAFF TIMESHEET INFOR WITH FILTER "month"
const selectAllStaffTimesheets = async (staffId, date) => {
  const staff_id = parseInt(staffId);
  console.log("check date", date);
  const { month, year } = extractMonthYear(date);
  console.log("check month", month);
  const result = await client.query(
    `SELECT work_date, actual_work_hours, notes, checkin, checkout, workdays
     FROM staff_timesheet_payroll 
     WHERE staff_id = $1
      AND EXTRACT(MONTH FROM TO_DATE(work_date, 'DD/MM/YYYY')) = $2
      AND EXTRACT(YEAR FROM TO_DATE(work_date, 'DD/MM/YYYY')) = $3`,
    [staff_id, month, year]
  );
  return result.rows;
};
module.exports = {
  insertBasicPayrollAndTimeSheet,
  selectAllStaffTimesheets,
};
