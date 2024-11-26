const { successResponse, failResponse } = require("../../../utils/apiResponse");
const menuIngredientServices = require("./menuIngredientServices");

// create menu ingredients
const createMenuIngredient = async (req, res) => {
  try {
    const menuIngredientData = req.body;
    const menuIngrdients =
      await menuIngredientServices.insertNewIngredientMenuItem(
        menuIngredientData
      );
    successResponse(res, menuIngrdients);
  } catch (error) {
    failResponse(res, error);
  }
};

// get all ingredients of menu item
const getMenuItemIngredient = async (req, res) => {
  const { owner_id, restaurant_id } = req.query;
  const { iId } = req.params;
  try {
    const allIngredients = await menuIngredientServices.getAllIngredientOfItem(
      iId,
      owner_id,
      restaurant_id
    );
    successResponse(res, allIngredients);
  } catch (error) {
    failResponse(res, error);
  }
};
module.exports = {
  createMenuIngredient,
  getMenuItemIngredient,
};
