const { client } = require("../../../../config/dbConfig");
const { formatMonthSalary } = require("../../../../utils/utility");

// CALCULATE AFTER-TAX SALARY OF STAFF BY MONTH
const calculateRealStaffSalary = async (staffId, month) => {
  const staff_id = parseInt(staffId);
  const monthPayment = formatMonthSalary(month.month);
  const bonus = 500000;
  const tax = 0.1;
  let realSalaryofMonth = 0;

  // Get 'net_salary' and 'require_workdays' form the 'staff' table
  const staffNetSalaryInfor = await client.query(
    `SELECT net_salary, require_workdays 
		FROM staff
		WHERE id = $1`,
    [staff_id]
  );
  let netSalary = staffNetSalaryInfor.rows[0].net_salary;
  let requireWorkdays = staffNetSalaryInfor.rows[0].require_workdays;

  // Calculate the actual number of workdays for an employee in a month
  const workdaysOfMonth = await client.query(
    `SELECT staff_id, SUM(workdays) AS total_workdays_of_month
  	 FROM staff_timesheet_payroll
  	 WHERE
  		staff_id = $1
  		AND TO_DATE(work_date, 'DD/MM/YYYY') >= DATE_TRUNC('MONTH', TO_DATE($2, 'MM/YYYY'))
      AND TO_DATE(work_date, 'DD/MM/YYYY') < DATE_TRUNC('MONTH', TO_DATE($2, 'MM/YYYY')) + INTERVAL '1 MONTH'
     GROUP BY
      staff_id;`,
    [staff_id, monthPayment]
  );

  const staffWorkdaysofMonth = parseFloat(
    workdaysOfMonth.rows[0]?.total_workdays_of_month || 0
  );

  // Compare with the 'require_workdays' to calculate the salary
  if (staffWorkdaysofMonth < requireWorkdays) {
    realSalaryofMonth += 270000 * staffWorkdaysofMonth + bonus;
  } else {
    realSalaryofMonth +=
      ((netSalary + bonus) / requireWorkdays) * staffWorkdaysofMonth;
  }

  // The after-tax salary
  const salaryAfterTax = realSalaryofMonth - realSalaryofMonth * tax;

  // Save to the table 'staff_month_salary '
  const salaryOfMonth = await client.query(
    `INSERT INTO staff_month_salary(staff_id, real_salary, actual_workdays, bonus, month_payment,tax)
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [staff_id, salaryAfterTax, staffWorkdaysofMonth, bonus, monthPayment, tax]
  );
  return salaryOfMonth.rows[0];
};

//GET SALARY INFORMATION FOR EACH MONTH OF THE YEAR PAID TO EMPLOYEES
const selectStaffSalary = async (staffId) => {
  const staff_id = parseInt(staffId);
  const result = await client.query(
    `SELECT * FROM staff_month_salary WHERE staff_id = $1`,
    [staff_id]
  );
  return result.rows;
};
module.exports = {
  calculateRealStaffSalary,
  selectStaffSalary,
};
