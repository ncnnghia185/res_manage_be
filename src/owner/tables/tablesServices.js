const { client } = require("../../../config/dbConfig");
const { validateTables } = require("../../../utils/validateData");
const { checkExist, updateQuery } = require("../../../utils/handleQuery");
const { applyFilter } = require("../../../utils/utility");
const { getStatusVi } = require("../../../utils/utility");
// INSERT NEW TABLE
const insertNewTable = async (data) => {
  // validate input data
  const value = validateTables(data);
  const status_Vi = getStatusVi(value.status);
  // insert into database
  const result = await client.query(
    `INSERT INTO tables(name, type_en, type_vi, capacity, status, status_vi, location_id, restaurant_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [
      value.name,
      value.type_en,
      value.type_vi,
      value.capacity,
      value.status,
      status_Vi,
      value.location_id,
      value.restaurant_id,
    ]
  );
  return result.rows[0];
};

// SELECT ONE TABLE
const selectOneTable = async (id) => {
  const condition = parseInt(id);
  const result = await client.query(`SELECT * FROM tables WHERE id = $1`, [
    condition,
  ]);
  checkExist(result.rows);
  return result.rows[0];
};

// SELECT ALL TABLES WITH FILTER
const selectAllTables = async (filter) => {
  const baseQuery = `SELECT * FROM tables WHERE active = true ORDER BY id ASC`;
  const sqlQuery = applyFilter(baseQuery, filter);
  const result = await client.query(sqlQuery);
  if (result.rows.length === 1) return result.rows[0];
  return result.rows;
};

// SELECT ORDER OF TABLE
const selectOrderOfTable = async (tableId) => {
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
    WHERE t.id = $1 AND t.status = 'occupied' `,
    [tableId]
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
const updateStatusTable = async (tableId) => {
  const table_id = parseInt(tableId);
  const result = await client.query(
    `UPDATE tables SET status = 'occupied', status_vi='Đang có khách' WHERE id = $1 RETURNING *`,
    [table_id]
  );
  return result.rows[0];
};

// UPDATE ONE TABLE INFOR
const updateOneTable = async (id, data) => {
  const baseQuery = `UPDATE tables SET `;
  const sqlQuery = updateQuery(baseQuery, id, data);

  const result = await client.query(sqlQuery.query, sqlQuery.values);
  return result.rows[0];
};

// CHANGE TABLE LOCATION
const changeTableLocation = async (tableId, newLocation) => {};

// DELETE ONE TABLE
const deleteOneTable = async (id) => {
  const condition = parseInt(id);
  await client.query(`DELETE FROM tables WHERE id = $1`, [condition]);
};

module.exports = {
  insertNewTable,
  selectOneTable,
  selectAllTables,
  selectOrderOfTable,
  updateOneTable,
  updateStatusTable,
  deleteOneTable,
};
