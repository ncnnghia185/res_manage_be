const router = require("express").Router();
const categoryControllers = require("./menuCategoryControllers");
const { upload } = require("../../../config/cloudinaryConfig");
router.post(
  "/add-category",
  upload.single("image"),
  categoryControllers.createNewCategory
);
router.get("/all-categories", categoryControllers.getAllCategoriesName);
router.get("/infor/:id", categoryControllers.getCategoryInfor);
router.put("/update/:id", categoryControllers.updateCategoryInfor);
router.delete("/delete/:id", categoryControllers.deleteCategory);

module.exports = router;
