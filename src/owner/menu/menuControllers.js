const { successResponse, failResponse } = require("../../../utils/apiResponse");
const menuServices = require("./menuServices");
const { cloudinary } = require("../../../config/cloudinaryConfig");
// Create new menu item
const createMenuItem = async (req, res) => {
  const { name, price, description, category_id, restaurant_id } = req.body;
  const imagePath = req.file.path;
  try {
    const uploadResult = await cloudinary.uploader.upload(imagePath);
    const imageUrl = uploadResult.secure_url;

    const itemData = {
      name,
      price,
      description,
      image: imageUrl,
      category_id,
      restaurant_id,
    };
    const menuItem = await menuServices.insertNewMenu(itemData);
    successResponse(res, menuItem);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get one menu item
const getOneMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await menuServices.selectOneMenu(id);
    successResponse(res, menuItem);
  } catch (error) {
    failResponse(res, error);
  }
};

// Get all menu items
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await menuServices.selectAllMenu();
    successResponse(res, menuItems);
  } catch (error) {
    failResponse(res, error);
  }
};

// Search menu items
const searchMenuItems = async (req, res) => {
  const query = req.query;

  try {
    const searchResult = await menuServices.searchMenuItems(query.query);
    successResponse(res, searchResult);
  } catch (error) {
    failResponse(res, error);
  }
};
// Update one menu item
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await menuServices.updateMenu(id, req.body);
    successResponse(res, updatedItem);
  } catch (error) {
    failResponse(res, error);
  }
};

// Delete one menu item
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    await menuServices.deleteMenu(id);
    successResponse(res);
  } catch (error) {
    failResponse(res, error);
  }
};

// Sort items by criteria
const sortItemsByCriteria = async (req, res) => {
  try {
    const { criteria } = req.query;
    const sortedItems = await menuServices.sortMenuItems(criteria);
    successResponse(res, sortedItems);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = {
  createMenuItem,
  getOneMenuItem,
  getAllMenuItems,
  deleteMenuItem,
  updateMenuItem,
  sortItemsByCriteria,
  searchMenuItems,
};
