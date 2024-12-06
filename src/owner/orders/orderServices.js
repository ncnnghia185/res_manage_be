const { checkExist, updateQuery } = require("../../../utils/handleQuery");
const { validateOrder } = require("../../../utils/validateData");
const { client } = require("../../../config/dbConfig");
const { applyFilter } = require("../../../utils/utility");

// INSERT NEW ORDER
const insertNewOrder = async (data) => {
  const value = validateOrder(data);

  await client.query("BEGIN");
  const result = await client.query(
    `INSERT INTO orders(id, table_id, order_time, customer_name, number_of_customer, order_status, notes, owner_id, restaurant_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, table_id`,
    [
      value.id,
      value.table_id,
      value.order_time,
      value.customer_name,
      value.number_of_customer,
      value.order_status,
      value.notes || null,
      value.owner_id,
      value.restaurant_id,
    ]
  );

  await client.query("COMMIT");
  const order_id = result.rows[0].id;
  const table_id = result.rows[0].table_id;
  return { orderId: order_id, tableId: table_id };
};

// SELECT ONE ORDER INFOR
const selectOneOrderInfor = async (orderId, oId, rId) => {
  const result = await client.query(
    `
  SELECT id, table_id, order_time, total_amount, order_status, notes, status_payment, customer_name, number_of_customer
  FROM orders WHERE id = $1 AND owner_id = $2 AND restaurant_id = $3`,
    [orderId, oId, rId]
  );

  return result.rows[0];
};

// SELECT ALL ORDER WITH FILTER
const selectAllOrdersInfor = async (filter) => {
  const baseQuery = ` 
  SELECT table_id, order_date, total_amount, status_en, status_vi, payment_en, payment_vi, customer_name 
  FROM orders`;
  const sqlQuery = applyFilter(baseQuery, filter);
  const result = await client.query(sqlQuery);
  return result.rows;
};

// SELECT SERVING ORDER OF TABLE
const selectServingOrderOfTable = async (table_id, oId, rId) => {
  const result = await client.query(
    `SELECT * FROM orders 
     WHERE table_id = $1 AND order_status = 'serving' 
     AND owner_id = $2 AND restaurant_id = $3 
     ORDER BY order_time DESC 
     LIMIT 1`,
    [table_id, oId, rId]
  );
  return result.rows[0];
};
// UPDATE ORDER PAYMENT_STATUS
const updateOneOrderPaymentStatus = async (oId, pStatus) => {
  const order_id = parseInt(oId);

  await client.query(`BEGIN`);
  if (Object.values(pStatus)[0] === "paid") {
    await client.query(
      `UPDATE orders 
       SET status = 'paid', payment_status = 'paid' 
       WHERE id = $1`,
      [order_id]
    );
  }
  await client.query(`COMMIT`);
};
// DELETE ORDER
const deleteOneOrderInfor = async (orderId) => {
  const condition = parseInt(orderId);
  await client.query(`DELETE FROM orders WHERE id = $1`, [condition]);
};
module.exports = {
  insertNewOrder,
  selectOneOrderInfor,
  selectAllOrdersInfor,
  deleteOneOrderInfor,
  updateOneOrderPaymentStatus,
  selectServingOrderOfTable,
};
