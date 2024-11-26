const { successResponse, failResponse } = require("../../../utils/apiResponse");
const { client } = require("../../../config/dbConfig");
const { generateAccessToken } = require("../../../middlewares/generateToken");
const { comparePassword } = require("../../../utils/utility");
const ownerServices = require("./ownerServices");

const registerOwnerAccout = async (req, res) => {
  // check email
  const existEmail = await client.query(
    `SELECT email FROM restaurant_owner WHERE email = $1`,
    [req.body.email]
  );
  if (existEmail.rows.length > 0) {
    return res.status(400).json({
      errCode: 1,
      success: false,
      message: "Email existed",
    });
  }
  try {
    const newAccout = await ownerServices.insertNewOwnerAccount(req.body);
    successResponse(res, newAccout);
  } catch (error) {
    failResponse(res, error);
  }
};

const loginOwnerAccout = async (req, res) => {
  const { username, phone, password } = req.body;
  if ((!username || !phone) && !password) {
    return res.status(200).json({
      errCode: 1,
      errMess: "Thiếu thông tin đăng nhập. Vui lòng điền đầy đủ thông tin!",
    });
  }
  try {
    const owner_account = await client.query(
      `SELECT * FROM restaurant_owner WHERE email = $1 OR phone = $2`,
      [username, phone]
    );
    if (owner_account.rows.length === 0) {
      return res.status(200).json({
        errCode: 2,
        errMess: "Tài khoản không tồn tại. Vui lòng kiểm tra lại!",
      });
    } else {
      const checkPassword = await comparePassword(
        password,
        owner_account.rows[0].password
      );
      if (!checkPassword) {
        return res.status(200).json({
          errCode: 3,
          errMess: "Mật khẩu không đúng. Vui lòng kiểm tra lại!",
        });
      }
      const accessToken = generateAccessToken(
        owner_account.rows[0].id,
        owner_account.rows[0].phone
      );

      return res.status(200).json({
        errCode: 0,
        accessToken: accessToken,
        userId: owner_account.rows[0].id,
      });
    }
  } catch (error) {
    failResponse(res, error);
  }
};

// Get restaurant owner infor
const getRestaurantOwnerInfor = async (req, res) => {
  try {
    const { uId } = req.params;
    const ownerInfor = await ownerServices.selectRestaurantOwnerInfor(uId);
    successResponse(res, ownerInfor);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = {
  registerOwnerAccout,
  loginOwnerAccout,
  getRestaurantOwnerInfor,
};
