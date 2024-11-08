const router = require("express").Router();
const menuController = require("./menuControllers");
const { upload } = require("../../../config/cloudinaryConfig");

router.post("/add-item", upload.single("image"), menuController.createMenuItem);
router.get("/item/:id", menuController.getOneMenuItem);
router.get("/all-item", menuController.getAllMenuItems);
router.get("/search-item", menuController.searchMenuItems);
router.get("/sort-items", menuController.sortItemsByCriteria);
router.put("/update/:id", menuController.updateMenuItem);
router.delete("/delete/item/:id", menuController.deleteMenuItem);
module.exports = router;
