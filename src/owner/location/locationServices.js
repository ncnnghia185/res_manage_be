const { validateLocation } = require("../../../utils/validateData");
const { checkExist, updateQuery } = require("../../../utils/handleQuery");
const { client } = require("../../../config/dbConfig");

// INSERT NEW LOCATION
const insertNewLocation = async (data) => {
  const value = validateLocation(data);
  const result = await client.query(
    `INSERT INTO locations(name, description, restaurant_id) VALUES ($1, $2, $3) RETURNING *`,
    [value.name, value.description, value.restaurant_id]
  );
  return result.rows[0];
};

// SELECT ONE LOCATION
const selectOneLocation = async (id, oId, rId) => {
  const condition = parseInt(id);
  const parseOId = parseInt(oId);
  const parseRId = parseInt(rId);
  // location infor
  const result = await client.query(
    `SELECT * FROM locations WHERE id = $1 AND owner_id = $2 AND restaurant_id = $3`,
    [condition, parseOId, parseRId]
  );
  checkExist(result.rows);

  // count number tables in this location
  const tableInLocation = await client.query(
    `SELECT l.name, COUNT(t.*) AS table_count
    FROM locations l
    JOIN tables t ON l.id = t.location_id 
    WHERE l.id = $1  AND l.owner_id = $2 AND l.restaurant_id = $3
    GROUP BY l.name`,
    [condition, parseOId, parseRId]
  );
  // get all tables in this location
  const tablesInLocation = await client.query(
    ` SELECT t.id, t.name, t.type_vi,t,type_en, t.capacity, t.status, t.status_vi 
      FROM tables t 
      JOIN locations l ON t.location_id = l.id 
      WHERE l.id = $1 AND l.owner_id = $2 AND l.restaurant_id = $3 AND t.active = true`,
    [condition, parseOId, parseRId]
  );
  return {
    locationInfor: result.rows[0],
    tablesInLocation: tablesInLocation.rows,
    count: tableInLocation.rows[0]?.table_count,
  };
};

// SELECT ALL LOCATIONS
const selectAllLocations = async (oId, rId) => {
  const parseOId = parseInt(oId);
  const parseRId = parseInt(rId);
  const result = await client.query(
    `SELECT id, name, description FROM locations WHERE active = true AND owner_id = $1 AND restaurant_id = $2 ORDER BY id ASC`,
    [parseOId, parseRId]
  );
  return result.rows;
};

// UPDATE ONE LOCATION
const updateOneLocation = async (id, data) => {
  const baseQuery = `UPDATE locations SET `;
  const sqlQuery = updateQuery(baseQuery, id, data);
  const result = await client.query(sqlQuery.query, sqlQuery.values);
  return result.rows[0];
};

// DELETE ONE LOCATION
const deleteOneLocation = async (id) => {
  const condition = parseInt(id);
  await client.query(`DELETE FROM locations WHERE id = $1`, [condition]);
};

module.exports = {
  insertNewLocation,
  selectOneLocation,
  selectAllLocations,
  updateOneLocation,
  deleteOneLocation,
};
