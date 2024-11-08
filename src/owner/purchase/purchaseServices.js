const { validatePurchase } = require("../../../utils/validateData");
const { updateQuery } = require("../../../utils/handleQuery");
const { client } = require("../../../config/dbConfig");

// INSERT NEW PURCHASE
const insertNewPurchase = async (data) => {
  const { date, purchases } = data;

  const insertedPurchases = [];
  await client.query(`BEGIN`);
  for (const purchase of purchases) {
    const total_price = purchase.quantity * purchase.unit_price;

    const text = `
      INSERT INTO purchase(date, restaurant_id, ingredient_name, quantity, unit, unit_price, total_price, note)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `;

    const values = [
      date,
      purchase.restaurant_id,
      purchase.ingredient_name,
      purchase.quantity,
      purchase.unit,
      purchase.unit_price,
      total_price,
      purchase.note || null,
    ];

    const result = await client.query(text, values);

    insertedPurchases.push(result.rows[0]);
  }

  await client.query(
    `
  INSERT INTO total_daily_purchase(date) 
  VALUES($1) ON CONFLICT (date) DO NOTHING
  `,
    [date]
  );
  await client.query(`COMMIT`);

  await client.query(`BEGIN`);
  const totalPriceItems = await client.query(
    `SELECT total_price FROM purchase WHERE date = $1`,
    [date]
  );

  const totalAmountOfPurchasedItems = totalPriceItems.rows.reduce(
    (accumulator, item) => accumulator + parseInt(item.total_price),
    0
  );

  // Get total amount purchased in database
  const totalAmountPurchaseQuery = await client.query(
    `SELECT total FROM total_daily_purchase WHERE date = $1`,
    [date]
  );

  let totalAmountOfPurchased = totalAmountOfPurchasedItems;
  if (totalAmountPurchaseQuery.rows[0].total === null) {
    await client.query(
      `UPDATE total_daily_purchase SET total = $1 WHERE date = $2`,
      [totalAmountOfPurchased, date]
    );
  }
  await client.query(`COMMIT`);
  return insertedPurchases;
};

// Select total price purchase by date
const selectTotalPricePurchasesByDate = async (date) => {
  const result = await client.query(
    `SELECT DISTINCT p.date, tdp.total 
		FROM purchase p 
		JOIN total_daily_purchase tdp ON p.date = tdp.date 
    WHERE p.date = $1`,
    [date]
  );
  return result.rows;
};

// Select item purchased by day
const selectItemsPurchasedByDay = async (date) => {
  const result = await client.query(
    `
		SELECT id,ingredient_name,quantity,unit,unit_price,total_price 
		FROM purchase WHERE date = $1
	`,
    [date]
  );
  return result.rows;
};

// const
// BY month
// SELECT SUM(total) AS total_purchase FROM total_daily_purchase
// WHERE to_char(to_date(date, 'YYYY/MM/DD'), 'YYYY') = '2024'
// AND to_char(to_date(date, 'YYYY/MM/DD'), 'MM') = '05';
// Update item and total purchased by day

// BY year
// SELECT SUM(total) AS total_purchase FROM total_daily_purchase
// WHERE to_char(to_date(date, 'YYYY/MM/DD'), 'YYYY') = '2024'

const updateItems = async (id, data) => {
  await client.query(`BEGIN`);
  const boughtItems = await client.query(
    `SELECT DISTINCT date, ingredient_name, quantity, unit, unit_price, total_price
    FROM purchase `
  );
};
// Delete item purchased by day
const deleteItems = async (id) => {
  const condition = parseInt(id);
  await client.query(`DELETE FROM purchase WHERE id = $1`, [condition]);
};
module.exports = {
  insertNewPurchase,
  selectTotalPricePurchasesByDate,
  selectItemsPurchasedByDay,
  updateItems,
  deleteItems,
};
