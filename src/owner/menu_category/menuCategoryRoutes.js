const router = require("express").Router();
const categoryControllers = require("./menuCategoryControllers");
const { verifyAccessToken } = require("../../../middlewares/verifyToken");
router.post(
  "/add-category",
  verifyAccessToken,
  categoryControllers.createNewCategory
);
router.get(
  "/all-categories",
  verifyAccessToken,
  categoryControllers.getAllCategoriesName
);
router.get(
  "/infor/:id",
  verifyAccessToken,
  categoryControllers.getCategoryInfor
);
router.put(
  "/update/:id",
  verifyAccessToken,
  categoryControllers.updateCategoryInfor
);
router.delete(
  "/delete/:id",
  verifyAccessToken,
  categoryControllers.deleteCategory
);

module.exports = router;
