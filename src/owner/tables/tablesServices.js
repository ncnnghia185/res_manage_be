const { client } = require("../../../config/dbConfig");
const { validateTables } = require("../../../utils/validateData");
const { checkExist, updateQuery } = require("../../../utils/handleQuery");
const { applyFilter } = require("../../../utils/utility");
const { getStatusVi } = require("../../../utils/utility");
// INSERT NEW TABLE
const insertNewTable = async (data) => {
  // validate input data
  const value = validateTables(data);
  // insert into database
  const result = await client.query(
    `INSERT INTO tables(name, type, capacity, status, location_id, restaurant_id, owner_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      value.name,
      value.type,
      value.capacity,
      value.status,
      parseInt(value.location_id),
      value.restaurant_id,
      value.owner_id,
    ]
  );
  return true;
};

// SELECT ONE TABLE
const selectOneTable = async (id, oId, rId) => {
  const condition = parseInt(id);
  const result = await client.query(
    `SELECT t.*, l.name AS location_name 
     FROM tables t JOIN locations l 
     ON t.location_id = l.id 
     WHERE t.id = $1 AND t.owner_id = $2 AND t.restaurant_id = $3`,
    [condition, oId, rId]
  );
  checkExist(result.rows);
  return result.rows[0];
};
// SELECT ALL TABLES
const selectAllTableWithoutFilter = async (oId, rId) => {
  const result = await client.query(
    `SELECT t.id, t.name, t.status, t.location_id, t.type, l.name AS location_name
     FROM tables t
     JOIN locations l ON t.location_id = l.id
     WHERE t.owner_id = $1 AND t.restaurant_id = $2
     ORDER BY t.id ASC`,
    [oId, rId]
  );
  return result.rows;
};
// SELECT ALL TABLES WITH FILTER
const selectAllTables = async (filter, oId, rId) => {
  const baseQuery = `SELECT * FROM tables WHERE active = true ORDER BY id ASC`;
  const sqlQuery = applyFilter(baseQuery, filter, oId, rId);
  const result = await client.query(sqlQuery);
  if (result.rows.length === 1) return result.rows[0];
  return result.rows;
};

// SELECT ORDER OF TABLE
const selectOrderOfTable = async (tableId, oId, rId) => {
  const result = await client.query(
    `
    SELECT  t.name as table_name, 
            o.id as order_id, 
            o.order_date as order_date,
            o.customer_name as order_customer_name,
            o.total_amount as order_total_amout,
            o.number_customers as order_number_customers,
            odt.item_name as order_item_name,
            odt.item_quantity as order_item_quantity,
            odt.item_price as order_item_price,
            odt.total_item_price as order_total_item_price
    FROM tables t 
    JOIN orders o ON t.id = o.table_id
    JOIN order_details odt ON o.id = odt.order_id
    WHERE t.id = $1 AND t.status = 'occupied' AND owner_id = $2 AND restaurant_id = $3`,
    [tableId, oId, rId]
  );
  const orderInfor = {
    table_name: result.rows[0].table_name,
    order_id: result.rows[0].order_id,
    order_date: result.rows[0].order_date,
    order_customer_name: result.rows[0].order_customer_name,
    order_number_customers: result.rows[0].order_number_customers,
  };
  const order_total_amout = result.rows[0].order_total_amout;
  const order_items = result.rows.map((row) => ({
    order_item_name: row.order_item_name,
    order_item_quantity: row.order_item_quantity,
    order_item_price: row.order_item_price,
    order_total_item_price: row.order_total_item_price,
  }));

  return {
    orderInfor,
    order_total_amout,
    order_items,
  };
};

// UPDATE TABLE STATUS AFTER ORDER SUCCESS
const updateStatusTable = async (tableId, oId, rId) => {
  const table_id = parseInt(tableId);
  await client.query(
    `UPDATE tables SET status = 'serving' WHERE id = $1 AND owner_id = $2 AND restaurant_id = $3 `,
    [table_id, oId, rId]
  );
  return true;
};

// UPDATE ONE TABLE INFOR
const updateOneTable = async (id, data, oId, rId) => {
  const baseQuery = `UPDATE tables SET `;
  const sqlQuery = updateQuery(baseQuery, id, data, oId, rId);

  const result = await client.query(sqlQuery.query, sqlQuery.values);
  return result.rows[0];
};

// CHANGE TABLE LOCATION
const changeTableLocation = async (tableId, newLocation) => {};

// DELETE ONE TABLE
const deleteOneTable = async (id, oId, rId) => {
  const condition = parseInt(id);
  await client.query(
    `DELETE FROM tables WHERE id = $1 AND owner_id = $2 AND restaurant_id = $3`,
    [condition, oId, rId]
  );
};

module.exports = {
  insertNewTable,
  selectOneTable,
  selectAllTableWithoutFilter,
  selectAllTables,
  selectOrderOfTable,
  updateOneTable,
  updateStatusTable,
  deleteOneTable,
};
