const { client } = require("../config/dbConfig");
// Handle error query
const errorQuery = async (error) => {
  await client.query(`ROLLBACK`);
  throw new Error(error);
};

// Update query
const updateQuery = (baseQuery, id, data, ownerId, restaurantId) => {
  if (Object.keys(data).length === 0) {
    throw new Error("Please provide data to update this");
  }
  const conditon = parseInt(id);
  let query = baseQuery;

  let values = [];
  let index = 1;

  for (const key in data) {
    if (data[key] !== null || data[key] !== undefined || data[key] !== "") {
      if (index > 1) {
        query += `,${key} = $${index}`;
      } else {
        query += `${key} = $${index}`;
      }
      values.push(data[key]);
      index++;
    }
  }
  query += ` WHERE id = $${index} AND owner_id = ${ownerId} AND restaurant_id = ${restaurantId} RETURNING *`;
  // const values = Object.values(data);

  values.push(conditon);

  return {
    query,
    values,
  };
};
// Check result exist in datbase
const checkExist = (result) => {
  if (result.length === 0 || result.length === undefined)
    throw new Error("No results found");
  return true;
};

module.exports = {
  errorQuery,
  checkExist,
  updateQuery,
};
