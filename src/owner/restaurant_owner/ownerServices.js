const { validateRestaurantOwner } = require("../../../utils/validateData");
const { hashPassword, comparePassword } = require("../../../utils/utility");
const { checkExist, updateQuery } = require("../../../utils/handleQuery");
const { client } = require("../../../config/dbConfig");
const { generateAccessToken } = require("../../../middlewares/generateToken");

// REGISTER NEW OWNER ACCOUNT
const insertNewOwnerAccount = async (data) => {
  const value = validateRestaurantOwner(data);
  const password = await hashPassword(value.password);
  const result = await client.query(
    `INSERT INTO restaurant_owner(email, fullname, password, phone) 
    VALUES ($1,$2,$3,$4) RETURNING *`,
    [value.email, value.fullname, password, value.phone]
  );
  return true;
};

// Save refresh token to cookie
const saveRefreshTokenToCookie = (response, refreshToken) => {
  response.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// LOGIN ACCOUNT OWNER
const loginAccount = async (data) => {
  // check input
  if ((!data.username && !data.phone) || !data.password) {
    throw new Error({
      statusCode: 400,
      message: "Username or phone and password is required.",
    });
  }
  const result = await client.query(
    `SELECT * FROM restaurant_owner WHERE username =$1 OR phone = $2 
    `,
    [data.username, data.phone]
  );

  // Check account
  if (result.rows.length === 0) {
    throw new Error({
      statusCode: 404,
      message: "Account not exist. Please try again.",
    });
  } else {
    // Compare input password vs user password in database
    const checkPassword = await comparePassword(
      data.password,
      result.rows[0].password
    );

    if (!checkPassword)
      throw new Error({
        statusCode: 401,
        message: "Password is incorrect. Please try again.",
      });
    // Generate access token
    const accessToken = generateAccessToken(
      result.rows[0].id,
      result.rows[0].phone
    );
    return {
      accessToken,
      user: result.rows[0]?.id,
    };
  }
};

// SELECT OWNER INFORMATION
const selectRestaurantOwnerInfor = async (userId) => {
  const condition = parseInt(userId);
  const result = await client.query(
    `SELECT id, username, email, fullname, phone, avatar 
    FROM restaurant_owner 
    WHERE id = $1`,
    [condition]
  );
  return result.rows[0];
};
// UPDATE OWNER INFORMATION

// CHANGE OWNER PASSWORD

// LOGOUT OWNER ACCOUNT
module.exports = {
  insertNewOwnerAccount,
  loginAccount,
  selectRestaurantOwnerInfor,
};
