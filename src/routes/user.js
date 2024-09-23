const router = require("express").Router();
const {
  AdminRegister,
  Login,
  Logout,
  DeleteUser,
  GetAllUsers,
  VendorRegister,
  GetSingleUser,
  UpdateUserPassword,
} = require("../controller/controller");
const { protect, Vendor, Admin } = require("../middleware/authorization");

router.post("/register", AdminRegister);
router.post("/register/vendor", VendorRegister);
router.post("/login", Login);
router.post("/logout", protect, Logout);
router.delete("/delete-user/:userId", [protect, Admin], DeleteUser);
router.get("/users", [protect,  Vendor], GetAllUsers);
router.get("/users/:userId", protect, GetSingleUser);
router.patch("/change-password", protect, UpdateUserPassword);

module.exports = router;
