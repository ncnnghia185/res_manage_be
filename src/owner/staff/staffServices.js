const { validateStaff } = require("../../../utils/validateData");
const { updateQuery } = require("../../../utils/handleQuery");
const { client } = require("../../../config/dbConfig");
const { formatDate } = require("../../../utils/utility");

// INSERT NEW STAFF
const insertNewStaff = async (data) => {
  const value = validateStaff(data);

  const result = await client.query(
    `INSERT INTO staff_infor (
    id, fullname, gender, date_of_birth, phone_number, address, identification_card, hire_date, net_salary, staff_type, position, owner_id, restaurant_id
    )
  	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
    [
      value.id,
      value.fullname,
      value.gender,
      value.date_of_birth || null,
      value.phone_number,
      value.address || null,
      value.identification_card || null,
      value.hire_date,
      value.net_salary,
      value.staff_type,
      value.position,
      value.owner_id,
      value.restaurant_id,
    ]
  );
  return result.rows[0];
};

// SELECT ONE STAFF
const selectOneStaff = async (id, oId, rId) => {
  const result = await client.query(
    `SELECT * FROM staff_infor WHERE id = $1 AND owner_id = $2 AND restaurant_id = $3`,
    [id, oId, rId]
  );
  return result.rows[0];
};

// SELECT ALL STAFFS
const selectAllStaffs = async (oId, rId) => {
  const result = await client.query(
    `SELECT id, fullname, gender, phone_number,hire_date, net_salary, position, staff_type, status_work FROM staff_infor WHERE owner_id = $1 AND restaurant_id = $2 ORDER BY hire_date ASC`,
    [oId, rId]
  );
  return result.rows;
};

// UPDATE ONE STAFF
const updateOneStaff = async (id, data, oId, rId) => {
  const baseQuery = `UPDATE staff_infor SET `;
  const sqlQuery = updateQuery(baseQuery, id, data, oId, rId);
  const result = await client.query(sqlQuery.query, sqlQuery.values);
  return result.rows[0];
};

// DELETE ONE STAFF
const deleteOneStaff = async (id, oId, rId) => {
  await client.query(
    `DELETE FROM staff_infor WHERE id = $1 AND owner_id = $2 AND restaurant_id = $3`,
    [id, oId, rId]
  );
};
module.exports = {
  insertNewStaff,
  selectOneStaff,
  selectAllStaffs,
  updateOneStaff,
  deleteOneStaff,
};
