const { validatePurchase } = require("../../../utils/validateData");
const { updateQuery } = require("../../../utils/handleQuery");
const { client } = require("../../../config/dbConfig");
const {
  insertNewInventory,
} = require("../inventory_ingredients/inventoryIngredientsServices");
const { normalizeIngredientName } = require("../../../utils/utility.js");
// INSERT NEW PURCHASE
const insertNewPurchase = async (data) => {
  const { date, owner_id, restaurant_id, purchases } = data;

  const insertedPurchases = [];
  await client.query(`BEGIN`);
  for (const purchase of purchases) {
    const text = `
      INSERT INTO purchase_ingredients(ingredient_name, quantity, unit, unit_price, note, date_purchase, owner_id, restaurant_id, total_purchase_item_price)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
    `;

    const values = [
      normalizeIngredientName(purchase.ingredient_name),
      purchase.quantity,
      purchase.unit,
      purchase.unit_price,
      purchase.note || null,
      date,
      owner_id,
      restaurant_id,
      purchase.total_purchase_item_price,
    ];

    const result = await client.query(text, values);

    insertedPurchases.push(result.rows[0]);
  }

  const totalDailyPurchaseAmount = purchases.reduce((total, purchase) => {
    return total + parseFloat(purchase.total_purchase_item_price);
  }, 0);
  const [day, month, year] = date.split("/").map(Number);
  const dateObj = new Date(year, month - 1, day);
  const yearValue = dateObj.getFullYear();
  const monthValue = dateObj.getMonth() + 1;
  await client.query(
    `
  INSERT INTO purchase_summary(date, month, year, total_daily_purchase, owner_id, restaurant_id) 
  VALUES($1, $2, $3, $4, $5, $6) ON CONFLICT (date) DO NOTHING 
  `,
    [
      date,
      monthValue,
      yearValue,
      totalDailyPurchaseAmount,
      owner_id,
      restaurant_id,
    ]
  );
  await insertNewInventory(purchases, date, owner_id, restaurant_id);
  await client.query(`COMMIT`);

  return insertedPurchases;
};

// Select total price purchase by date
const selectTotalPricePurchasesByDate = async (date) => {
  const result = await client.query(
    `SELECT DISTINCT p.date_purchase, ps.total_daily_purchase 
		FROM purchase_ingredients p 
		JOIN purchase_summary ps ON TO_DATE(p.date_purchase, 'DD/MM/YYYY') = TO_DATE(ps.date, 'DD/MM/YYYY')
    WHERE TO_DATE(p.date_purchase, 'DD/MM/YYYY') = TO_DATE($1, 'DD/MM/YYYY');`,
    [date]
  );
  return result.rows;
};

// Select item purchased by day
const selectItemsPurchasedByDay = async (date, owner_id, restaurant_id) => {
  const result = await client.query(
    `
		SELECT id, ingredient_name, quantity, unit, unit_price, note, total_purchase_item_price 
		FROM purchase_ingredients WHERE date_purchase = $1 AND owner_id = $2 AND restaurant_id = $3
	`,
    [date, owner_id, restaurant_id]
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
const deleteItems = async (id, owner_id, restaurant_id) => {
  const condition = parseInt(id);
  await client.query(`BEGIN`);
  const result = await client.query(
    `SELECT ingredient_name, quantity, total_purchase_item_price, date_purchase 
     FROM purchase_ingredients 
     WHERE id = $1 AND owner_id = $2 AND restaurant_id = $3`,
    [condition, owner_id, restaurant_id]
  );
  if (result.rows.length === 0) {
    return false;
  }

  const {
    ingredient_name,
    quantity,
    total_purchase_item_price,
    date_purchase,
  } = result.rows[0];
  await client.query(
    `DELETE FROM purchase_ingredients WHERE id = $1 AND owner_id = $2 AND restaurant_id = $3`,
    [condition, owner_id, restaurant_id]
  );
  // Cập nhật tổng tiền mua hàng trong purchase_summary
  const updateSummaryResult = await client.query(
    `UPDATE purchase_summary 
     SET total_daily_purchase = total_daily_purchase - $1 
     WHERE owner_id = $2 AND restaurant_id = $3 AND date = $4 
     RETURNING total_daily_purchase, id`,
    [total_purchase_item_price, owner_id, restaurant_id, date_purchase]
  );
  // Nếu total_daily_purchase = 0, xóa bản ghi trong bảng purchase_summary
  const updatedTotal = updateSummaryResult.rows[0].total_daily_purchase;
  if (updatedTotal === 0) {
    await client.query(
      `DELETE FROM purchase_summary 
       WHERE owner_id = $1 AND restaurant_id = $2 AND id = $3`,
      [owner_id, restaurant_id, updateSummaryResult.rows[0].id]
    );
  }

  // Kiểm tra và cập nhật lại số lượng trong inventory_ingredients
  const inventoryResult = await client.query(
    `SELECT quantity, last_update FROM inventory_ingredients 
     WHERE ingredient_name = $1 AND owner_id = $2 AND restaurant_id = $3`,
    [ingredient_name, owner_id, restaurant_id]
  );
  if (inventoryResult.rows.length > 0) {
    // Nếu có, trừ số lượng và cập nhật last_update
    const { quantity: currentQuantity, last_update } = inventoryResult.rows[0];

    await client.query(
      `UPDATE inventory_ingredients 
       SET quantity = quantity - $1, last_update = NOW() 
       WHERE ingredient_name = $2 AND owner_id = $3 AND restaurant_id = $4`,
      [quantity, ingredient_name, owner_id, restaurant_id]
    );
  }
  await client.query(`COMMIT`);
  return true;
};

// get all purchase summary
const selectAllPurchaseSummaryByMonth = async (
  month,
  year,
  owner_id,
  restaurant_id
) => {
  const result = await client.query(
    `
    SELECT * FROM purchase_summary 
    WHERE month = $1 AND year = $2 
    AND owner_id = $3 
    AND restaurant_id = $4`,
    [month, year, owner_id, restaurant_id]
  );
  return result.rows;
};

const selectPurchaseSummaryByDate = async (date, owner_id, restaurant_id) => {
  const result = await client.query(
    `SELECT * FROM purchase_summary WHERE date = $1 AND owner_id = $2 AND restaurant_id = $3`,
    [date, owner_id, restaurant_id]
  );

  return result.rows[0];
};

module.exports = {
  insertNewPurchase,
  selectTotalPricePurchasesByDate,
  selectItemsPurchasedByDay,
  updateItems,
  deleteItems,
  selectAllPurchaseSummaryByMonth,
  selectPurchaseSummaryByDate,
};
