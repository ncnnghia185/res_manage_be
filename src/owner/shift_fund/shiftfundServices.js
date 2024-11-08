const { client } = require("../../../config/dbConfig");
const { updateQuery } = require("../../../utils/handleQuery");

// INSERT SHIFT FUND OPEN
const insertShiftFundOpen = async (data) => {
  const result = await client.query(
    `INSERT INTO shift_fund(shift_date, start_time, open_amount, notes)
		VALUES($1, $2, $3, $4)`,
    [data.shift_date, data.start_time, data.open_amount, data.notes || null]
  );
  return result.rows[0];
};

// UPDATE SHIFT FUND END
const updateShiftFundEnd = async (data, id) => {
  const result = await client.query(
    `UPDATE shift_fund SET end_time = $1, close_amount = $2, notes = $3 WHERE id = $4 RETURNING *`,
    [data.end_time, data.close_amount, data.notes || null, id]
  );
  return result.rows[0];
};

// GET SHIFT FUND OF DAY
const selectDailyShiftFund = async (date) => {
  const result = await client.query(
    `SELECT * FROM shift_fund WHERE shift_date = $1`,
    [date]
  );
  return result.rows[0];
};

// UPDATE SHIFT FUND INFOR
const updateShiftFundInfor = async (data, id) => {
  const baseQuery = `UPDATE shift_fund SET `;
  const sqlQuery = updateQuery(baseQuery, data, id);
  const result = await client.query(sqlQuery.query, sqlQuery.values);
  return result.rows[0];
};
module.exports = {
  insertShiftFundOpen,
  updateShiftFundEnd,
  selectDailyShiftFund,
  updateShiftFundInfor,
};
