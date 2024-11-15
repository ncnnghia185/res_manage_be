const { updateQuery } = require("../../../utils/handleQuery");
const { validateRestaurantInfor } = require("../../../utils/validateData");
const { client } = require("../../../config/dbConfig");

// INSERT NEW INFOR
const insertNewRestaurantInfor = async (data, ownerId) => {
  const value = await validateRestaurantInfor(data);
  const result = await client.query(
    `INSERT INTO restaurant_infor(name, address, phone_number, image, description, owner_id) 
    VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [
      value.name,
      value.address,
      value.phone_number,
      value.image || null,
      value.description || null,
      ownerId,
    ]
  );
  return result.rows[0];
};
// SELECT RESTAURANT NAME
const selectAllRestaurantName = async (ownerId) => {
  const condition = parseInt(ownerId);
  const result = await client.query(
    `SELECT id, name FROM restaurant_infor WHERE owner_id = $1 ORDER BY id ASC`,
    [condition]
  );

  return result.rows;
};

// SELECT ONE RESTAURANT NAME
const selectOneRestaurantName = async (resId, ownId) => {
  const result = await client.query(
    `SELECT * FROM restaurant_infor WHERE id = $1 AND owner_id = $2`,
    [resId, ownId]
  );
  if (result.rows[0].length === 0) {
    return [];
  }
  return result.rows[0];
};
// SELECT  RESTAURANT INFORMATION
const selectRestaurantInfor = async (userId, resId) => {
  const condition = parseInt(userId);
  const conditionRes = parseInt(resId);
  const result = await client.query(
    `SELECT i.*,o.username,o.phone,o.avatar 
    FROM restaurant_infor i 
    JOIN restaurant_owner o ON i.owner_id = o.id
     WHERE o.id = $1 AND i.id = $2`,
    [condition, conditionRes]
  );
  return result.rows[0];
};

// UPDATE RESTAURANT INFORMATION
const updateOneRestaurant = async (id, data) => {
  const baseQuery = `UPDATE restaurant_infor SET `;
  const sqlQuery = updateQuery(baseQuery, id, data);
  const result = await client.query(sqlQuery.query, sqlQuery.values);
  return result.rows[0];
};

// DELETE RESTAURANT
const deleteOneRestaurant = async (id) => {
  const condition = parseInt(id);
  await client.query(`DELETE FROM restaurant_infor WHERE id = $1`, [condition]);
};
module.exports = {
  insertNewRestaurantInfor,
  selectAllRestaurantName,
  selectRestaurantInfor,
  selectOneRestaurantName,
  updateOneRestaurant,
  deleteOneRestaurant,
};
