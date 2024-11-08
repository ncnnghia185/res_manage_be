const { client } = require("../../../config/dbConfig");
const { validateOrderDetails } = require("../../../utils/validateData");
const { checkExist, updateQuery } = require("../../../utils/handleQuery");

// INSERT NEW ORDER DETAILS
const insertNewOrderDetails = async (orderId, tableId, data) => {
  const order_id = parseInt(orderId);
  const table_id = parseInt(tableId);
  const order_details = data;
  const insertedOrderDetails = [];
  //Transaction to insert into 'order_details' table
  await client.query(`BEGIN`);
  for (const detail of order_details) {
    const { name, id, price, quantity, restaurant_id, total_item_price } =
      detail;
    // Get the id of item from menu table
    // const item = await client.query(
    //   `SELECT id,price FROM menu WHERE name = $1`,
    //   [detail.item_name]
    // );
    // checkExist(item.rows);
    // const item_id = item.rows[0].id;
    // const item_price = item.rows[0].price;

    // // Calculate the item total price
    // let item_total_price = item_price * detail.item_quantity;

    // Insert into order_details table
    const text = `
      INSERT INTO order_details(table_id, order_id, item_name, item_quantity, item_price, total_item_price, item_id, restaurant_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
    const values = [
      table_id,
      order_id,
      name,
      quantity,
      price,
      total_item_price,
      id,
      restaurant_id,
    ];

    const result = await client.query(text, values);
    insertedOrderDetails.push(result.rows[0]);
  }

  await client.query(`COMMIT`);

  // Transaction to update 'orders' table
  await client.query("BEGIN");

  // Calculate total amount of current item in order
  const totalAmountOfCurrentItems = insertedOrderDetails.reduce(
    (accumulator, item) => accumulator + item.total_item_price,
    0
  );

  // Get total amount in database
  const totalAmountQuery = await client.query(
    `SELECT total_amount FROM orders WHERE id = $1`,
    [order_id]
  );

  let totalAmountOfOrder = totalAmountOfCurrentItems;
  if (totalAmountQuery.rows.length > 0) {
    const totalAmountOfExistItems = totalAmountQuery.rows[0].total_amount || 0;
    totalAmountOfOrder += totalAmountOfExistItems;
  }

  // Update status to 'pending payment' and total_amount in 'orders' table
  await client.query(
    `UPDATE orders
      SET status_en = 'pending payment', 
          status_vi ='Chờ thanh toán',
          total_amount = $1
      WHERE id = $2`,
    [totalAmountOfOrder, order_id]
  );

  await client.query("COMMIT");

  return insertedOrderDetails;
};

// SELECT ONE ORDER DETAILS => PRINT BILL
const selectOneOrderDetails = async (orderId, tableId) => {
  const order_id = parseInt(orderId);
  const table_id = parseInt(tableId);
  const values = [order_id, table_id];

  await client.query(`BEGIN`);
  // Order
  const orderCommand = `
  SELECT o.total_amount, o.id, o.table_id, o.order_date, o.customer_name
  FROM orders o
  WHERE o.id = $1 AND o.table_id = $2
  `;
  const orderResult = await client.query(orderCommand, values);

  // Order Details
  const orderDetailsCommand = ` 
  SELECT item_name, item_quantity, item_price, total_item_price
  FROM order_details 
  WHERE order_id = $1 AND table_id = $2
  `;
  const orderDetailsResult = await client.query(orderDetailsCommand, values);

  await client.query(`COMMIT`);
  // Return => Bill Infor
  const orderInfor = orderResult.rows[0];
  const orderDetailsInfor = orderDetailsResult.rows;
  return {
    orderInfor,
    orderDetailsInfor,
  };
};

// UPDATE ORDER DETAILS ITEMS
const updateOrderDetailItems = async (data) => {
  const addItems = data?.addItems;

  await client.query("BEGIN");

  for (const item of addItems) {
    const orderedItems = await client.query(
      `
        SELECT order_id, table_id, item_id, item_quantity, total_item_price 
        FROM order_details 
        WHERE order_id = $1 AND item_id = $2
        `,
      [data.order_id, item.id]
    );

    if (orderedItems.rows.length > 0) {
      const currentItem = orderedItems.rows[0];
      const updatedQuantity =
        parseInt(currentItem.item_quantity) + parseInt(item.quantity);
      const updatedTotalPrice =
        parseFloat(currentItem.total_item_price) +
        parseInt(item.quantity) * parseFloat(item.price);

      await client.query(
        `
          UPDATE order_details 
          SET item_quantity = $1, total_item_price = $2 
          WHERE order_id = $3 AND item_id = $4
          `,
        [
          updatedQuantity.toString(),
          updatedTotalPrice.toString(),
          data.order_id,
          item.id,
        ]
      );
    } else {
      await client.query(
        `
          INSERT INTO order_details(table_id, order_id, item_name, item_quantity, item_price, total_item_price, item_id, restaurant_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          data.table_id,
          data.order_id,
          item.name,
          item.quantity,
          item.price,
          parseInt(item.quantity) * parseFloat(item.price),
          item.id,
          data.restaurant_id,
        ]
      );
    }
  }

  const totalAmountOfCurrentOrder = await client.query(
    `
      SELECT total_amount FROM orders WHERE id = $1`,
    [data.order_id]
  );

  const currentTotalAmount = parseFloat(
    totalAmountOfCurrentOrder.rows[0].total_amount
  );
  const totalOfAddItems = addItems.reduce(
    (accumulator, item) =>
      accumulator + parseInt(item.quantity) * parseFloat(item.price),
    0
  );

  const totalAmountOfNewOrder = currentTotalAmount + totalOfAddItems;

  await client.query(
    `
      UPDATE orders SET total_amount = $1 WHERE id = $2`,
    [totalAmountOfNewOrder.toString(), data.order_id]
  );

  await client.query("COMMIT");
  return { total_amount: totalAmountOfNewOrder };
};
module.exports = {
  insertNewOrderDetails,
  selectOneOrderDetails,
  updateOrderDetailItems,
};
