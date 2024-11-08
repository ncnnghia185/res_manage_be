const { successResponse, failResponse } = require("../../../utils/apiResponse");
const categoryServices = require("./menuCategoryServices");
const { cloudinary } = require("../../../config/cloudinaryConfig");
// Create new category
const createNewCategory = async (req, res) => {
  const { name, description } = req.body;
  let imageUrl = null;

  try {
    // Check if an image file was uploaded
    if (req.file) {
      const imagePath = req.file.path;
      const uploadResult = await cloudinary.uploader.upload(imagePath, {
        folder: "category_images",
      });
      imageUrl = uploadResult.secure_url;
    }

    const categoryData = {
      name,
      image: imageUrl, // This will be `null` if no image was uploaded
      description,
    };

    const newCategory = await categoryServices.insertNewCategory(categoryData);
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
  try {
    const allName = await categoryServices.selectAllCategories();
    successResponse(res, allName);
  } catch (error) {
    failResponse(res, error);
  }
};

// Update category infor
const updateCategoryInfor = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await categoryServices.updateOneCategory(
      id,
      req.body
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
    await categoryServices.deleteOneCategory(id);
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
