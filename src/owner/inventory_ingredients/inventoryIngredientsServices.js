const { client } = require("../../../config/dbConfig");
const { normalizeIngredientName } = require("../../../utils/utility.js");
const insertNewInventory = async (purchases, date, owner_id, restaurant_id) => {
  for (const purchase of purchases) {
    const text = `INSERT INTO inventory_ingredients(ingredient_name, quantity, unit, date_added, owner_id, restaurant_id) 
                      VALUES ($1, $2, $3, $4, $5, $6)
                      ON CONFLICT(ingredient_name, restaurant_id)
                      DO UPDATE SET quantity = inventory_ingredients.quantity + EXCLUDED.quantity`;
    const values = [
      normalizeIngredientName(purchase.ingredient_name),
      purchase.quantity,
      purchase.unit,
      date,
      owner_id,
      restaurant_id,
    ];
    await client.query(text, values);
  }
  return true;
};

module.exports = {
  insertNewInventory,
};
