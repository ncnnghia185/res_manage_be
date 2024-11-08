const { client } = require("../../../config/dbConfig");
const { validateMonthlyExpenses } = require("../../../utils/validateData");
const { updateQuery } = require("../../../utils/handleQuery");

// INSERT NEW EXPENSE
const insertNewExpense = async (data) => {
  const value = validateMonthlyExpenses(data);
  const result = await client.query(
    `INSERT INTO monthly_expenses(expense_date, expense_type, amount, description, restaurant_id)
	 VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      value.expense_date,
      value.expense_type,
      value.amount,
      value.description || null,
      value.restaurant_id,
    ]
  );
  return result.rows[0];
};

// SELECT ONE EXPENSE INFOR
const selectOneExpense = async (id) => {
  const condition = parseInt(id);
  const result = await client.query(
    `SELECT * FROM monthly_expenses WHERE id = $1`,
    [condition]
  );
  return result.rows[0];
};
// SELECT ALL EXPENSES INFOR
const selectAllExpenses = async () => {
  const result = await client.query(
    `SELECT * FROM monthly_expenses ORDER BY id ASC`
  );
  return result.rows;
};

// UPDATE ONE EXPENSE INFOR
const updateOneExpense = async (id, data) => {
  const baseQuery = `UPDATE monthly_expenses SET `;
  const sqlQuery = updateQuery(baseQuery, id, data);
  const result = await client.query(sqlQuery.query, sqlQuery.values);
  return result.rows[0];
};
// DELETE ONE EXPENSE INFOR
const deleteOneExpense = async (id) => {
  const condition = parseInt(id);
  await client.query(`DELETE FROM monthly_expenses WHERE id = $1`, [condition]);
};

module.exports = {
  insertNewExpense,
  selectOneExpense,
  selectAllExpenses,
  updateOneExpense,
  deleteOneExpense,
};
