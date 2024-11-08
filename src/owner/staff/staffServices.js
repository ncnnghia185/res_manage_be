const { validateStaff } = require("../../../utils/validateData");
const { updateQuery } = require("../../../utils/handleQuery");
const { client } = require("../../../config/dbConfig");
const { formatDate } = require("../../../utils/utility");

// INSERT NEW STAFF
const insertNewStaff = async (data) => {
  const value = validateStaff(data);

  const result = await client.query(
    `INSERT INTO staff(fullname, gender, date_of_birth, phonenumber, address, identification_card, hire_date, restaurant_id, net_salary, status_work)
  	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [
      value.fullname,
      value.gender,
      value.date_of_birth || null,
      value.phonenumber,
      value.address || null,
      value.identification_card || null,
      value.hire_date,
      value.restaurant_id,
      value.net_salary,
      value.status_work,
    ]
  );
  return result.rows[0];
};

// SELECT ONE STAFF
const selectOneStaff = async (id) => {
  const condition = parseInt(id);
  const result = await client.query(`SELECT * FROM staff WHERE id = $1`, [
    condition,
  ]);
  return result.rows[0];
};

// SELECT ALL STAFFS
const selectAllStaffs = async () => {
  const result = await client.query(`SELECT * FROM staff ORDER BY id ASC`);
  return result.rows;
};

// UPDATE ONE STAFF
const updateOneStaff = async (id, data) => {
  const baseQuery = `UPDATE staff SET `;
  const sqlQuery = updateQuery(baseQuery, id, data);
  const result = await client.query(sqlQuery.query, sqlQuery.values);
  return result.rows[0];
};

// DELETE ONE STAFF
const deleteOneStaff = async (id) => {
  const condition = parseInt(id);
  await client.query(`DELETE FROM staff WHERE id = $1`, [condition]);
};
module.exports = {
  insertNewStaff,
  selectOneStaff,
  selectAllStaffs,
  updateOneStaff,
  deleteOneStaff,
};
