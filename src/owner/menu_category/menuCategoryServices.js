const { checkExist, updateQuery } = require("../../../utils/handleQuery");
const { validateCategory } = require("../../../utils/validateData");
const { client } = require("../../../config/dbConfig");

// INSERT NEW CATEGORY
const insertNewCategory = async (data) => {
  const value = validateCategory(data);
  const result = await client.query(
    `INSERT INTO categories(name, image, description, restaurant_id) 
    VALUES ($1, $2, $3, $4) RETURNING *`,
    [
      value.name,
      value.image || null,
      value.description || null,
      value.restaurant_id,
    ]
  );
  return result.rows[0];
};

// SELECT ONE CATEGORY
const selectOneCategory = async (id) => {
  const condition = parseInt(id);
  const result = await client.query(
    `SELECT name,image, description FROM categories WHERE id = $1`,
    [condition]
  );
  checkExist(result.rows);
  const itemOfCategory = await client.query(
    `
      SELECT m.id, m.name, m.price, m.description, m.image
      FROM menu m
      JOIN categories c ON m.category_id = c.id
      WHERE c.id = $1
     `,
    [condition]
  );

  return {
    categoryInfor: result.rows[0],
    itemsCategory: itemOfCategory.rows,
  };
};

// SELECT ALL CATEGORY
const selectAllCategories = async () => {
  const result = await client.query(
    `SELECT id,name, image, description FROM categories`
  );
  // checkExist(result.rows);
  return result.rows;
};

// UPDATE ONE CATEGORY
const updateOneCategory = async (id, data) => {
  const baseQuery = `UPDATE categories SET `;
  const sqlQuery = updateQuery(baseQuery, id, data);
  const result = await client.query(sqlQuery.query, sqlQuery.values);
  return result.rows[0];
};

// DELETE ONE CATEGORY
const deleteOneCategory = async (id) => {
  const condition = parseInt(id);
  await client.query(`DELETE FROM categories WHERE id = $1`, [condition]);
};

module.exports = {
  insertNewCategory,
  selectOneCategory,
  selectAllCategories,
  updateOneCategory,
  deleteOneCategory,
};
