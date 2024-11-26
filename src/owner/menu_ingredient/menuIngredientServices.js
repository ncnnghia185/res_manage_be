const { client } = require("../../../config/dbConfig");
const { validateIngredientOfMenuItem } = require("../../../utils/validateData");

// INSERT NEW INGREDIENT OF MENU ITEM
const insertNewIngredientMenuItem = async (menuItemData) => {
  const { menu_item_id, owner_id, restaurant_id, ingredients } = menuItemData;

  // Kiểm tra nếu mảng ingredients là rỗng hoặc không tồn tại
  if (!ingredients || ingredients.length === 1) {
    if (
      ingredients[0].ingredient_name === "" &&
      ingredients[0].quantity === 0 &&
      ingredients[0].ingredient_unit === "" &&
      ingredients[0].cost_per_unit === 0
    ) {
      const insertBasicMenuItemQuery = `
      INSERT INTO menu_item_ingredient (
        menu_item_id, owner_id, restaurant_id
      ) VALUES ($1, $2, $3)
    `;

      await client.query(insertBasicMenuItemQuery, [
        menu_item_id,
        owner_id,
        restaurant_id,
      ]);

      return true;
    }
  }

  // Trường hợp mảng ingredients không rỗng, thực hiện thêm đầy đủ dữ liệu
  const insertMenuItemQuery = `
    INSERT INTO menu_item_ingredient (
      menu_item_id, ingredient_name, quantity, ingredient_unit,
      cost_per_unit, owner_id, restaurant_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;

  for (const ingredient of ingredients) {
    const value = validateIngredientOfMenuItem(ingredient);

    await client.query(insertMenuItemQuery, [
      menu_item_id,
      value.ingredient_name,
      value.quantity,
      value.ingredient_unit,
      value.cost_per_unit,
      owner_id,
      restaurant_id,
    ]);
  }

  return true;
};

// get all ingredients of a menu item
const getAllIngredientOfItem = async (itemId, oId, rId) => {
  console.log("check itemId", itemId);
  const result = await client.query(
    `SELECT * FROM menu_item_ingredient WHERE menu_item_id = $1 AND owner_id = $2 AND restaurant_id = $3`,
    [itemId, oId, rId]
  );
  return result.rows;
};
module.exports = { insertNewIngredientMenuItem, getAllIngredientOfItem };
