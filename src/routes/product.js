const router = require("express").Router();
const { AddNewProduct, GetAllProducts, GetSingleProduct, DeleteProduct, UpdateProduct, CreateStore } = require("../controller/controller");


const { protect, Admin, Vendor } = require("../middleware/authorization");

router.post("/add-product", protect, Vendor, AddNewProduct);
router.post("/add-store", protect, Vendor, CreateStore);
router.get("/", GetAllProducts);

router.get("/:productId",  GetSingleProduct);

router.delete("/:productId", protect, Vendor, DeleteProduct);
router.patch("/:productId", protect, Vendor, UpdateProduct);


module.exports = router;
