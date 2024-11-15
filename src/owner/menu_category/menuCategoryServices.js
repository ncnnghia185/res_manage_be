const { checkExist, updateQuery } = require("../../../utils/handleQuery");
const { validateCategory } = require("../../../utils/validateData");
const { client } = require("../../../config/dbConfig");

// INSERT NEW CATEGORY
const insertNewCategory = async (data) => {
  const value = validateCategory(data);
  const result = await client.query(
    `INSERT INTO categories(name,owner_id, restaurant_id) 
    VALUES ($1, $2, $3) RETURNING id, name`,
    [value.name, value.owner_id, value.restaurant_id]
  );
  return result.rows[0];
};

// SELECT ONE CATEGORY
const selectOneCategory = async (id, oId, rId) => {
  const condition = parseInt(id);
  const result = await client.query(
    `SELECT name,image, description FROM categories WHERE id = $1 AND owner_id = $2 AND restaurant_id = $3`,
    [condition, oId, rId]
  );
  checkExist(result.rows);
  const itemOfCategory = await client.query(
    `
      SELECT m.id, m.name, m.price, m.description, m.image
      FROM menu m
      JOIN categories c ON m.category_id = c.id
      WHERE c.id = $1 
     `,
    [condition, oId, rId]
  );

  return {
    categoryInfor: result.rows[0],
    itemsCategory: itemOfCategory.rows,
  };
};

// SELECT ALL CATEGORY
const selectAllCategories = async (oId, rId) => {
  const result = await client.query(
    `SELECT id, name FROM categories WHERE owner_id = $1 AND restaurant_id = $2 ORDER BY id ASC`,
    [oId, rId]
  );
  return result.rows;
};

// UPDATE ONE CATEGORY
const updateOneCategory = async (id, data, oId, rId) => {
  const baseQuery = `UPDATE categories SET `;
  const sqlQuery = updateQuery(baseQuery, id, data, oId, rId);
  const result = await client.query(sqlQuery.query, sqlQuery.values);
  return result.rows[0];
};

// DELETE ONE CATEGORY
const deleteOneCategory = async (id, oId, rId) => {
  const condition = parseInt(id);
  await client.query(
    `DELETE FROM categories WHERE id = $1 AND owner_id = $2 AND restaurant_id = $3`,
    [condition, oId, rId]
  );
};

module.exports = {
  insertNewCategory,
  selectOneCategory,
  selectAllCategories,
  updateOneCategory,
  deleteOneCategory,
};
