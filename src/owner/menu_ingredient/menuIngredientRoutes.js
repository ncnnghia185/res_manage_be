const router = require("express").Router();
const menuIngredientControllers = require("./menuIngredientController");
const { verifyAccessToken } = require("../../../middlewares/verifyToken");

router.post(
  "/add-ingredient",
  verifyAccessToken,
  menuIngredientControllers.createMenuIngredient
);

router.get(
  "/ingredient-by-menu/:iId",
  verifyAccessToken,
  menuIngredientControllers.getMenuItemIngredient
);

module.exports = router;
