const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
// Hash password
const hashPassword = async (password) => {
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

// Compare Password
const comparePassword = async (passwordInput, passwordDB) => {
  try {
    const isMatch = await bcrypt.compare(passwordInput, passwordDB);
    return isMatch;
  } catch (error) {
    return false;
  }
};
// FORMAT DATE TO 'DD/MM/YYYY'
const formatDate = (dateStr) => {
  let typeDate = "-";
  if (dateStr.includes("/")) {
    typeDate = "/";
  }
  const parts = dateStr.split(typeDate);
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  return `${day}/${month}/${year}`;
};

// FORMAT MONTH FOR PAY SALARY
const formatMonthSalary = (monthStr) => {
  let monthFormatted;
  if (monthStr.includes("Tháng")) {
    const monthArray = monthStr.split(" ");
    const monthYear = monthArray[1];
    const [month, year] = monthYear.split("/");
    monthFormatted = month.padStart(2, "0");
    return monthFormatted + "/" + year;
  }
};
// FILTER
const applyFilter = (baseQuery, filter, owner_id, restaurant_id) => {
  // Check have filter
  if (!filter || Object.keys(filter).length === 0) {
    return baseQuery;
  }
  let query = baseQuery;

  // Add filter to sql query
  const filterKeys = Object.keys(filter);
  const numFilters = filterKeys.length;
  let filterCount = 0;
  query += ` WHERE owner_id = ${owner_id} AND restaurant_id = ${restaurant_id}`;

  filterKeys.forEach((key) => {
    query += ` ${key} = '${filter[key]}'`;
    // If not final filter
    if (filterCount < numFilters - 1) {
      query += " AND ";
    }
    filterCount++;
  });

  return query;
};

// SORT
const sortResult = () => {};
// PAGINATION
const paginationData = () => {};

// normalize name
const normalizeIngredientName = (name) => {
  return name.normalize("NFC").toLowerCase().trim();
};
module.exports = {
  applyFilter,
  sortResult,
  paginationData,
  hashPassword,
  comparePassword,
  formatDate,
  formatMonthSalary,
  normalizeIngredientName,
};
