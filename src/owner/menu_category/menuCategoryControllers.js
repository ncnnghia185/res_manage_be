const { successResponse, failResponse } = require("../../../utils/apiResponse");
const categoryServices = require("./menuCategoryServices");
const { cloudinary } = require("../../../config/cloudinaryConfig");
// Create new category
const createNewCategory = async (req, res) => {
  try {
    const newCategory = await categoryServices.insertNewCategory(req.body);
    successResponse(res, newCategory);
  } catch (error) {
    failResponse(res, error);
  }
};

// Select one category
const getCategoryInfor = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryInfor = await categoryServices.selectOneCategory(id);
    successResponse(res, categoryInfor);
  } catch (error) {
    failResponse(res, error);
  }
};

// Select all categories name
const getAllCategoriesName = async (req, res) => {
  const { owner_id, restaurant_id } = req.query;
  try {
    const allName = await categoryServices.selectAllCategories(
      owner_id,
      restaurant_id
    );
    successResponse(res, allName);
  } catch (error) {
    failResponse(res, error);
  }
};

// Update category infor
const updateCategoryInfor = async (req, res) => {
  try {
    const { id } = req.params;
    const { owner_id, restaurant_id } = req.query;
    const updatedCategory = await categoryServices.updateOneCategory(
      id,
      req.body,
      owner_id,
      restaurant_id
    );
    successResponse(res, updatedCategory);
  } catch (error) {
    failResponse(res, error);
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { owner_id, restaurant_id } = req.query;
    await categoryServices.deleteOneCategory(id, owner_id, restaurant_id);
    successResponse(res);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = {
  createNewCategory,
  getCategoryInfor,
  getAllCategoriesName,
  updateCategoryInfor,
  deleteCategory,
};
