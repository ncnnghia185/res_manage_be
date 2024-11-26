const router = require("express").Router();
const menuController = require("./menuControllers");
const { upload } = require("../../../config/cloudinaryConfig");
const { verifyAccessToken } = require("../../../middlewares/verifyToken");

router.post(
  "/add-item",
  upload.single("image"),
  verifyAccessToken,
  menuController.createMenuItem
);
router.get("/item/:id", verifyAccessToken, menuController.getOneMenuItem);
router.get("/all-item", verifyAccessToken, menuController.getAllMenuItems);
router.get("/search-item", menuController.searchMenuItems);
router.get("/sort-items", menuController.sortItemsByCriteria);
router.put("/update/:id", menuController.updateMenuItem);
router.delete("/delete/:id", verifyAccessToken, menuController.deleteMenuItem);
module.exports = router;
