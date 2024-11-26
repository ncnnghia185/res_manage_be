const { client } = require("../../../config/dbConfig");
const { validateMenu } = require("../../../utils/validateData");
const { checkExist, updateQuery } = require("../../../utils/handleQuery");

// INSERT NEW MENU
const insertNewMenu = async (data) => {
  // validate input data
  const value = validateMenu(data);
  // insert into database
  const result = await client.query(
    `INSERT INTO menu_item(id, name, price, description, image, category_id, original_price, restaurant_id, owner_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      value.id,
      value.name,
      value.price,
      value.description || null,
      value.image,
      value.category_id,
      value.original_price,
      value.restaurant_id,
      value.owner_id,
    ]
  );

  return result.rows[0];
};

// SELECT ONE MENU ITEM
const selectOneMenu = async (id, oId, rId) => {
  const result = await client.query(
    `SELECT mi.*, mi_i.ingredient_name, mi_i.quantity, mi_i.ingredient_unit, mi_i.cost_per_unit
     FROM menu_item AS mi
     JOIN menu_item_ingredient AS mi_i
     ON mi.id = mi_i.menu_item_id
     WHERE mi.id = $1 AND mi.owner_id = $2 AND mi.restaurant_id = $3
    `,
    [id, oId, rId]
  );
  const generalInfo = {
    id: result.rows[0].id,
    name: result.rows[0].name,
    price: result.rows[0].price,
    description: result.rows[0].description,
    image: result.rows[0].image,
    category_id: result.rows[0].category_id,
    original_cost: result.rows[0].original_price,
  };

  const ingredients = result.rows.map((row) => ({
    ingredient_name: row.ingredient_name,
    quantity: row.quantity,
    ingredient_unit: row.ingredient_unit,
    cost_per_unit: row.cost_per_unit,
  }));

  return { generalInfo, ingredients };
};

// SELECT ALL MENU ITEMS
const selectAllMenu = async (oId, rId) => {
  const result = await client.query(
    `SELECT id, name, image, price, category_id FROM menu_item WHERE owner_id = $1 AND restaurant_id = $2 ORDER BY created_at DESC`,
    [oId, rId]
  );

  return result.rows;
};

// SORT MENU ITEMS BY SOLD QUANTITY AND TOTAL REVENUE
const sortMenuItems = async (sortCriteria) => {
  let result;
  switch (sortCriteria) {
    case "soldQuantity":
      result = await client.query(`
        SELECT menu_item.id, menu_item.name, COUNT(order_details.item_id) AS total_ordered
        FROM menu_item 
        LEFT JOIN order_details ON menu.id = order_details.item_id
        GROUP BY menu_item.id, menu_item.name
        ORDER BY total_ordered DESC`);

      break;
    case "totalRevenue":
      result = await client.query(`
        SELECT menu_item.id, menu_item.name, COALESCE(SUM(order_details.total_item_price),0) AS total_priced
        FROM menu_item
        LEFT JOIN order_details ON menu_item.id = order_details.item_id
        GROUP BY menu_item.id, menu_item.name
        ORDER BY total_priced DESC`);

      break;
    default:
      throw new Error("Invalid sort criteria");
  }
  return result.rows;
};

// SEARCH MENU ITEMS
const searchMenuItems = async (search) => {
  const result = await client.query(
    `SELECT * FROM menu_item WHERE name ILIKE $1`,
    [`%${search}%`]
  );
  return result.rows;
};
// UPDATE ONE MENU
const updateMenu = async (id, data) => {
  const baseQuery = `UPDATE menu_item SET `;
  const sqlQuery = updateQuery(baseQuery, id, data);

  const result = await client.query(sqlQuery.query, sqlQuery.values);
  return result.rows[0];
};

// DELETE ONE MENU
const deleteMenu = async (id, oId, rId) => {
  await client.query("BEGIN");
  await client.query(
    `WITH deleted_ingredients AS (
    DELETE FROM menu_item_ingredient WHERE menu_item_id = $1 AND owner_id = $2 AND restaurant_id = $3
    )
    DELETE FROM menu_item WHERE id = $1 AND owner_id = $2 AND restaurant_id = $3;`,
    [id, oId, rId]
  );
  await client.query("COMMIT");
  return true;
};

// SORT MENU ITEM
module.exports = {
  insertNewMenu,
  selectOneMenu,
  selectAllMenu,
  updateMenu,
  deleteMenu,
  sortMenuItems,
  searchMenuItems,
};
