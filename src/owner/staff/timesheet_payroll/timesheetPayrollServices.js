const { updateQuery } = require("../../../../utils/handleQuery");
const { client } = require("../../../../config/dbConfig");
const {
  validateStaffPayrollAndTimeSheet,
} = require("../../../../utils/validateData");

const {
  calculateWorkTime,
  calculateActualWorkHours,
} = require("../../../../utils/calculateWorkTime");

const { differenceInMinutes, parse } = require("date-fns");
const { v4: uuidv4 } = require("uuid");
const extractMonthYear = (dateStr) => {
  const [monthStr, yearStr] = dateStr.split("/");
  const month = parseInt(monthStr.replace("Tháng ", ""));
  const year = parseInt(yearStr);
  return { month, year };
};

// INSERT BASIC STAFF PAYROLL AND TIMESHEET INFOR
const insertStartWorkTime = async (data, owner_id, restaurant_id) => {
  const value = validateStaffPayrollAndTimeSheet(data.shift_work);
  const workDate = new Date(value.work_date);
  const month = workDate.getMonth() + 1;
  const year = workDate.getFullYear();

  await client.query("BEGIN");
  const payrollCheck = await client.query(
    `SELECT * FROM payrolls WHERE staff_id = $1 AND month_payroll = $2 AND year_payroll = $3 AND owner_id = $4 AND restaurant_id = $5`,
    [value.staff_id, month, year, owner_id, restaurant_id]
  );

  if (payrollCheck.rows.length === 0) {
    const totalWorkdays = parseFloat(0);
    const uuid = uuidv4();
    const payrollId = "PR-" + uuid.replace(/-/g, "").slice(0, 6).toUpperCase();
    await client.query(
      `INSERT INTO payrolls (id,staff_id, total_workdays, owner_id, restaurant_id, month_payroll, year_payroll)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        payrollId,
        value.staff_id,
        totalWorkdays,
        owner_id,
        restaurant_id,
        month,
        year,
      ]
    );
  }
  const result = await client.query(
    `INSERT INTO shifts_work(id, staff_id, work_date, start_time, owner_id, restaurant_id)
     VALUES($1, $2, $3, $4, $5, $6)`,
    [
      value.id,
      value.staff_id,
      value.work_date,
      value.start_time,
      owner_id,
      restaurant_id,
    ]
  );

  await client.query(
    `INSERT INTO staff_attendances(id, staff_id, shift_id, work_date, owner_id, restaurant_id, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7) `,
    [
      data.attendance.id,
      value.staff_id,
      value.id,
      value.work_date,
      owner_id,
      restaurant_id,
      data.attendance.notes || null,
    ]
  );
  await client.query("COMMIT");
  return true;
};

// UPDATE END TIME SHIFT WORK OF STAFF
const updateEndWorkTime = async (
  shift_id,
  staff_id,
  owner_id,
  restaurant_id,
  data
) => {
  // select start work time
  const startTime = await client.query(
    `SELECT * FROM shifts_work WHERE id = $1 AND staff_id = $2 AND owner_id = $3 AND restaurant_id = $4`,
    [shift_id, staff_id, owner_id, restaurant_id]
  );

  const staff_start_time = startTime.rows[0].start_time;
  const format = "HH:mm:ss";
  const start = parse(staff_start_time, format, new Date());
  const end = parse(data.shifts_work.end_time, format, new Date());

  if (end < start) throw new Error("End time must be after start time");

  const totalMinutes = differenceInMinutes(end, start);
  const totalHours = totalMinutes / 60;
  let workday = (totalHours / 10).toFixed(2);
  workday = parseFloat(workday) > 1 ? 1 : parseFloat(workday);
  await client.query("BEGIN");
  await client.query(
    `UPDATE shifts_work 
    SET end_time = $1, total_hours_work = $2 
    WHERE id = $3 AND staff_id = $4 AND owner_id = $5 AND restaurant_id = $6`,
    [
      data.shifts_work.end_time,
      totalHours.toFixed(2),
      shift_id,
      staff_id,
      owner_id,
      restaurant_id,
    ]
  );

  await client.query(
    `UPDATE staff_attendances 
    SET daily_status_work = $1, workday = $2, notes = $3
    WHERE id = $4 AND staff_id = $5 AND owner_id = $6 AND restaurant_id = $7`,
    [
      data.attendance.daily_status_work,
      workday,
      data.attendance.notes || null,
      shift_id,
      staff_id,
      owner_id,
      restaurant_id,
    ]
  );

  const staff_payroll = await client.query(
    `SELECT total_workdays 
    FROM payrolls 
    WHERE staff_id = $1 AND owner_id = $2 AND restaurant_id = $3`,
    [staff_id, owner_id, restaurant_id]
  );
  // const staff_total_workdays = staff_payroll.rows[0].total_workdays
  let staff_total_workdays = 0;

  staff_total_workdays = parseFloat(staff_payroll.rows[0].total_workdays);

  const newTotalWorkdays = staff_total_workdays + parseFloat(workday);
  await client.query(
    `UPDATE payrolls 
    SET total_workdays = $1, notes = $2 
    WHERE staff_id = $3 AND owner_id = $4 AND restaurant_id = $5`,
    [
      newTotalWorkdays.toFixed(2),
      data.attendance.notes || null,
      staff_id,
      owner_id,
      restaurant_id,
    ]
  );
  await client.query("COMMIT");
  return true;
};

// SELECT ALL STAFF TIMESHEET INFOR WITH FILTER "month"
const selectAllStaffsPayrollsByMonth = async (
  month_payroll,
  year_payroll,
  owner_id,
  restaurant_id
) => {
  const result_payrolls = await client.query(
    `SELECT id, staff_id, total_workdays, notes FROM payrolls 
    WHERE month_payroll = $1 AND year_payroll = $2 AND owner_id = $3 AND restaurant_id = $4`,
    [month_payroll, year_payroll, owner_id, restaurant_id]
  );

  return result_payrolls.rows;
};

module.exports = {
  insertStartWorkTime,
  updateEndWorkTime,
  selectAllStaffsPayrollsByMonth,
};
