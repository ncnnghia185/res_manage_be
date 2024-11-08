const { checkExist, updateQuery } = require("../../../utils/handleQuery");
const { validateOrder } = require("../../../utils/validateData");
const { client } = require("../../../config/dbConfig");
const { applyFilter } = require("../../../utils/utility");

// INSERT NEW ORDER
const insertNewOrder = async (data) => {
  const value = validateOrder(data);

  const result = await client.query(
    `INSERT INTO orders(table_id, order_date, customer_name, number_customers, restaurant_id) 
    VALUES ($1, $2, $3, $4, $5) RETURNING id, table_id`,
    [
      value.table_id,
      value.order_date,
      value.customer_name,
      value.number_customers,
      value.restaurant_id,
    ]
  );
  const order_id = result.rows[0].id;
  const table_id = result.rows[0].table_id;
  return { orderId: order_id, tableId: table_id };
};

// SELECT ONE ORDER INFOR
const selectOneOrderInfor = async (orderId) => {
  const condition = parseInt(orderId);
  const result = await client.query(
    `
  SELECT id, table_id, order_date,total_amount, status, payment_status, customer_name, number_customers
  FROM orders WHERE id = $1`,
    [condition]
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
};
