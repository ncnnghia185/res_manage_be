const { client } = require("../../../config/dbConfig");
const { formatDate } = require("../../../utils/utility");

// STATISTIC PROFIT BY DAY
const statisticProfitByDay = async (date) => {
  let profit = 0;

  // Calculate Total amount order by day
  const revenueByDayQuery = await client.query(
    `
    SELECT DISTINCT order_date, sum(total_amount) AS total_amount
    FROM orders
    WHERE payment_status = 'paid' AND status = 'paid' AND order_date = $1
    GROUP BY order_date
    `,
    [date]
  );

  // Calculate Total purchase by day
  const purchaseByDayQuery = await client.query(
    `SELECT date, total FROM total_daily_purchase WHERE date = $1`,
    [date]
  );

  const revenueByDay = parseInt(revenueByDayQuery.rows[0].total_amount || 0);
  const purchaseByDay = parseInt(purchaseByDayQuery.rows[0].total || 0);
  // Calculate profit = total amount order by day - total purchase by day
  profit = revenueByDay - purchaseByDay;

  return {
    revenueByDay: revenueByDay,
    purchaseByDay: purchaseByDay,
    profit: profit,
  };
};

// STATISTIC PROFIT BY MONTH
const statisticProfitByMonth = async (data) => {
  let profitByMonth = 0;
  const month = data.split(" ");
  // Calculate total amount order by month
  const revenueByMonthQuery = await client.query(
    `SELECT SUM(total_amount) AS total_revenue
    FROM orders
    WHERE EXTRACT (MONTH FROM TO_DATE(order_date,'YYYY/MM/DD')) = $1`,
    [month[1]]
  );

  // Calculate total purchase by month
  const purchaseByMonthQuery = await client.query(
    `SELECT SUM(total) AS total_purchase
    FROM total_daily_purchase 
    WHERE EXTRACT (MONTH FROM TO_DATE(date,'YYYY/MM/DD')) = $1`,
    [month[1]]
  );

  // Calculate total expenses by month
  const expensesByMonthQuery = await client.query(
    `SELECT SUM(amount) AS total_expenses
    FROM monthly_expenses
    WHERE EXTRACT (MONTH FROM TO_DATE(expense_date,'YYYY/MM/DD')) = $1`,
    [month[1]]
  );

  // Get salary of staff by month
  const getSalaryByMonthQuery = await client.query(
    `SELECT SUM(daily_salary) AS total_salary
    FROM staff_timesheet_payroll
    WHERE EXTRACT (MONTH FROM TO_DATE(work_date,'YYYY/MM/DD')) = $1`,
    [month[1]]
  );
  const revenueByMonth = parseInt(
    revenueByMonthQuery.rows[0]?.total_revenue || 0
  );
  const purchaseByMonth = parseInt(
    purchaseByMonthQuery.rows[0]?.total_purchase || 0
  );
  const expenseByMonth = parseInt(
    expensesByMonthQuery.rows[0]?.total_expenses || 0
  );
  const staffsalaryByMonth = parseInt(
    getSalaryByMonthQuery.rows[0]?.total_salary || 0
  );

  profitByMonth =
    revenueByMonth - (purchaseByMonth + expenseByMonth + staffsalaryByMonth);
  return {
    revenueByMonth: revenueByMonth,
    purchaseByMonth: purchaseByMonth,
    expenseByMonth: expenseByMonth,
    staffsalaryByMonth: staffsalaryByMonth,
    profitByMonth: profitByMonth,
  };
};

// STATISTIC PROFIT BY YEAR
const statisticProfitByYear = async () => {};

const statisticTableOrderByDay = async () => {};
const statisticTableOrderByMonth = async () => {};
const statisticMenuItemsOrderByDay = async () => {};
const statisticMenuItemsOrderByMonth = async () => {};
const statisticMenuItemsOrderByYear = async () => {};
const statisticCustomerByDay = async () => {};
const statisticCustomerByMonth = async () => {};
const statisticCustomerByYear = async () => {};
module.exports = {
  statisticProfitByDay,
  statisticProfitByMonth,
  statisticProfitByYear,
  statisticTableOrderByDay,
  statisticTableOrderByMonth,
  statisticMenuItemsOrderByDay,
  statisticMenuItemsOrderByMonth,
  statisticMenuItemsOrderByYear,
  statisticCustomerByDay,
  statisticCustomerByMonth,
  statisticCustomerByYear,
};
