const { client } = require("../../../config/dbConfig");
const { validateMenu } = require("../../../utils/validateData");
const { checkExist, updateQuery } = require("../../../utils/handleQuery");

// INSERT NEW MENU
const insertNewMenu = async (data) => {
  // validate input data
  const value = validateMenu(data);
  // insert into database
  const result = await client.query(
    `INSERT INTO menu(name, price, description, image, category_id, restaurant_id, owner_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      value.name,
      value.price,
      value.description,
      value.image || null,
      value.category_id,
      value.restaurant_id,
      value.owner_id,
    ]
  );

  return result.rows[0];
};

// SELECT ONE MENU ITEM
const selectOneMenu = async (id) => {
  const condition = parseInt(id);
  const result = await client.query(
    `
  SELECT m.id, m.name, m.price, m.cost, m.description, m.image, c.name AS category_name, c.id AS category_id
  FROM menu m
  JOIN categories c ON m.category_id = c.id 
  WHERE m.id = $1 `,
    [condition]
  );
  checkExist(result.rows);
  return result.rows[0];
};

// SELECT ALL MENU ITEMS
const selectAllMenu = async () => {
  const result = await client.query(`SELECT * FROM menu ORDER BY id DESC`);

  return result.rows;
};

// SORT MENU ITEMS BY SOLD QUANTITY AND TOTAL REVENUE
const sortMenuItems = async (sortCriteria) => {
  let result;
  switch (sortCriteria) {
    case "soldQuantity":
      result = await client.query(`
        SELECT menu.id, menu.name, COUNT(order_details.item_id) AS total_ordered
        FROM menu
        LEFT JOIN order_details ON menu.id = order_details.item_id
        GROUP BY menu.id, menu.name
        ORDER BY total_ordered DESC`);

      break;
    case "totalRevenue":
      result = await client.query(`
        SELECT menu.id, menu.name, COALESCE(SUM(order_details.total_item_price),0) AS total_priced
        FROM menu
        LEFT JOIN order_details ON menu.id = order_details.item_id
        GROUP BY menu.id, menu.name
        ORDER BY total_priced DESC`);

      break;
    default:
      throw new Error("Invalid sort criteria");
  }
  return result.rows;
};

// SEARCH MENU ITEMS
const searchMenuItems = async (search) => {
  const result = await client.query(`SELECT * FROM menu WHERE name ILIKE $1`, [
    `%${search}%`,
  ]);
  return result.rows;
};
// UPDATE ONE MENU
const updateMenu = async (id, data) => {
  const baseQuery = `UPDATE menu SET `;
  const sqlQuery = updateQuery(baseQuery, id, data);

  const result = await client.query(sqlQuery.query, sqlQuery.values);
  return result.rows[0];
};

// DELETE ONE MENU
const deleteMenu = async (id) => {
  const condition = parseInt(id);
  await client.query(`DELETE FROM menu WHERE id = $1`, [condition]);
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
