const { client } = require("../../../config/dbConfig");
const { updateQuery } = require("../../../utils/handleQuery");
const { validateShiftFund } = require("../../../utils/validateData");

// INSERT SHIFT FUND OPEN
const insertShiftFundOpen = async (data) => {
  const value = validateShiftFund(data);
  const notesValue = value.notes ? value.notes.trim() : "";
  await client.query(
    `INSERT INTO shift_fund(id, shift_date, open_time, open_cash, notes, owner_id, restaurant_id)
		VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      value.id,
      value.shift_date,
      value.open_time,
      value.open_cash,
      notesValue,
      value.owner_id,
      value.restaurant_id,
    ]
  );
  return true;
};

// UPDATE SHIFT FUND END
const updateShiftFundEnd = async (data, id, owner_id, restaurant_id) => {
  await client.query(
    `UPDATE shift_fund SET end_time = $1, close_cash = $2, total_revenue = $3, expenses = $4 WHERE id = $5 AND owner_id = $6 AND restaurant_id = $7`,
    [
      data.end_time,
      data.close_cash,
      data.total_revenue,
      data.expenses || null,
      id,
      owner_id,
      restaurant_id,
    ]
  );
  return true;
};

// GET SHIFT FUND OF DAY
const selectDailyShiftFund = async (date, owner_id, restaurant_id) => {
  const result = await client.query(
    `SELECT * FROM shift_fund WHERE shift_date = $1 AND owner_id = $2 AND restaurant_id = $3`,
    [date, owner_id, restaurant_id]
  );
  return result.rows;
};

// GET SHIFT FUND BY ID
const selectDailyShiftFundById = async (id, owner_id, restaurant_id) => {
  const result = await client.query(
    `SELECT * FROM shift_fund WHERE id = $1 AND owner_id = $2 AND restaurant_id = $3`,
    [id, owner_id, restaurant_id]
  );
  return result.rows[0];
};

// UPDATE SHIFT FUND INFOR
const updateShiftFundNotes = async (data, id, owner_id, restaurant_id) => {
  await client.query(
    `UPDATE shift_fund SET notes = $1 WHERE id = $2 AND owner_id = $3 AND restaurant_id = $4`,
    [data, id, owner_id, restaurant_id]
  );
  return true;
};
module.exports = {
  insertShiftFundOpen,
  updateShiftFundEnd,
  selectDailyShiftFund,
  updateShiftFundNotes,
  selectDailyShiftFundById,
};
