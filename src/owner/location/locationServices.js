const { validateLocation } = require("../../../utils/validateData");
const { checkExist, updateQuery } = require("../../../utils/handleQuery");
const { client } = require("../../../config/dbConfig");

// INSERT NEW LOCATION
const insertNewLocation = async (data) => {
  const value = validateLocation(data);
  const result = await client.query(
    `INSERT INTO locations(name, restaurant_id, owner_id) VALUES ($1, $2, $3) RETURNING id, name, active`,
    [value.name, value.restaurant_id, value.owner_id]
  );
  return result.rows[0];
};

// SELECT ONE LOCATION
const selectOneLocation = async (id, oId, rId) => {
  const condition = parseInt(id);
  const parseOId = parseInt(oId);
  const parseRId = parseInt(rId);

  // count number tables in this location
  const tableInLocation = await client.query(
    `SELECT COUNT(t.*) AS table_count
    FROM locations l
    JOIN tables t ON l.id = t.location_id 
    WHERE l.id = $1  AND l.owner_id = $2 AND l.restaurant_id = $3
    `,
    [condition, parseOId, parseRId]
  );

  const count = tableInLocation.rows[0]?.table_count;
  return count;
};

// SELECT ALL LOCATIONS
const selectAllLocations = async (oId, rId) => {
  const parseOId = parseInt(oId);
  const parseRId = parseInt(rId);
  const result = await client.query(
    `SELECT id, name, active FROM locations WHERE active = true AND owner_id = $1 AND restaurant_id = $2 ORDER BY id ASC`,
    [parseOId, parseRId]
  );
  return result.rows;
};

// UPDATE ONE LOCATION
const updateOneLocation = async (id, data, oId, rId) => {
  const result = await client.query(
    `UPDATE locations SET name = $1 WHERE id = $2 AND owner_id = $3 AND restaurant_id = $4`,
    [data, id, oId, rId]
  );
  return result.rows[0];
};

// DELETE ONE LOCATION
const deleteOneLocation = async (id, oId, rId) => {
  const condition = parseInt(id);
  await client.query(
    `DELETE FROM locations WHERE id = $1 AND owner_id = $2 AND restaurant_id = $3`,
    [condition, oId, rId]
  );
};

module.exports = {
  insertNewLocation,
  selectOneLocation,
  selectAllLocations,
  updateOneLocation,
  deleteOneLocation,
};
