const { User } = require("../model");
const Product = require("../model/product-model");
const Store = require("../model/store-model");
const { registerSchema, loginSchema, GenerateToken, productSchema, GeneratePassword, GenerateSalt } = require("../utils/index");
const { option } = require("../utils/index");
const bcrypt = require("bcrypt");
const {redisClient} = require("../config");
const {convertCurrency} = require("../utils");

/************************ AUTH *************************/

// REGISTER AS AN ADMIN
const AdminRegister = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const validateRegister = registerSchema.validate(req.body, option);
    if (validateRegister.error) {
      return res
        .status(400)
        .json({ Error: validateRegister.error.details[0].message });
    }
    //Generate salt
    const salt = await GenerateSalt(10);
    //Encrypting password
    const adminPassword = await GeneratePassword(password, salt);
    const admin = await User.findOne({ $or: [{ email }, { username }] });

    if (admin) {
      if (admin.username === username) {
        return res.status(400).json({ Error: "Username already exists" });
      }
      if (admin.email === email) {
        return res.status(400).json({ Error: "Admin email already exists" });
      }
    }

    //create admin
    const user = await User.create({
      username,
      email,
      password: adminPassword,
      role: "admin",
    });
    return res.status(201).json({
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

// REGISTER AS A VENDOR
const VendorRegister = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;
    const validateRegister = registerSchema.validate(req.body, option);
    if (validateRegister.error) {
      return res
        .status(400)
        .json({ Error: validateRegister.error.details[0].message });
    }
    //Generate salt
    const salt = await GenerateSalt(10);
    //Encrypting password
    const adminPassword = await GeneratePassword(password, salt);
    const admin = await User.findOne({ $or: [{ email }, { username }] });

    if (admin) {
      if (admin.username === username) {
        return res.status(400).json({ Error: "Username already exists" });
      }
      if (admin.email === email) {
        return res.status(400).json({ Error: "Admin email already exists" });
      }
    }

    //create admin
    const user = await User.create({
      username,
      email,
      password: adminPassword,
      role: "user",
    });
    return res.status(201).json({
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

// LOGIN
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validateRegister = loginSchema.validate(req.body, option);
    if (validateRegister.error) {
      return res
        .status(400)
        .json({ Error: validateRegister.error.details[0].message });
    }
    // Find the admin by email
    const user = await User.findOne({ where: { email } });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "Not a registered User" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    // Generate and return a token if the login is successful
    const token = await GenerateToken({
      id: user.id,
      email: user.email,
    });
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// LOGOUT
const Logout = async (req, res) => {
  try{
    res.clearCookie("token"); 
    
    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

// UPDATE USER PASSWORD
const UpdateUserPassword = async (req, res) => {
  try {
    const userId  = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid current password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await User.update({ password: hashedNewPassword }, { where: { id: userId } });

    return res.status(200).json({
      message: "User password updated successfully",
    });
  } catch (error) {
    console.error("Error during user password update:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


/********************** USERS *************************/

// GET ALL USERS
const GetAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    const query = role ? { role } : {};

    const users = await User.findAll({ where: query });

    const count = users.length;

    return res.status(200).json({
      count,
      users,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// GET A SINGLE USER
const GetSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error while fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//DELETE USER
const DeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.destroy({ where: { id: userId } });

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error during user deletion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


/******************************* PRODUCTS ****************************/

// CREATE USER STORE
const CreateStore = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const newStore = await Store.create({
      name,
      user_id: userId,
    });

    return res
      .status(201)
      .json({ message: "Store created successfully", store: newStore });
  } catch (error) {
    console.error("Error creating store:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ADD NEW PRODUCT
const AddNewProduct = async (req, res) => {
  try {
    const { error, value } = productSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ Error: error.details.map((detail) => detail.message) });
    }

    const user_id = req.user.id;

    const store = await Store.findOne({ where: { user_id } });

    if (!store) {
      return res.status(404).json({ error: "Store not found for this user." });
    }

    const newProduct = await Product.create({
      name: value.name,
      description: value.description,
      price: value.price,
      quantity: value.quantity,
      category: value.category,
      store_id: store.id,
      user_id,
    });

    return res.status(201).json({
      message: "New product has been uploaded successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET ALL PRODUCT

const GetAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 6, name, productType, brand } = req.query;

    const currentPage = parseInt(page, 10);
    const limitPerPage = parseInt(limit, 10);
    const offset = (currentPage - 1) * limitPerPage;

    const where = {};

    if (name) {
      where.name = {
        [Op.iLike]: `%${name}%`,
      };
    }
    if (productType) {
      where.productType = {
        [Op.iLike]: `%${productType}%`,
      };
    }
    if (brand) {
      where.brand = {
        [Op.iLike]: `%${brand}%`,
      };
    }

    const cacheKey = `products:page=${currentPage}&limit=${limitPerPage}&name=${
      name || ""
    }&productType=${productType || ""}&brand=${brand || ""}`;

    const cachedProducts = await redisClient.get(cacheKey);

    if (cachedProducts) {
      return res.status(200).json({
        success: true,
        message: "Products retrieved successfully (from cache)",
        data: JSON.parse(cachedProducts),
        currentPage,
      });
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit: limitPerPage,
      offset,
      order: [["id", "DESC"]],
    });

    const totalPages = Math.ceil(count / limitPerPage);

    await redisClient.setEx(
      cacheKey,
      3600,
      JSON.stringify({ products, totalPages })
    );

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
      totalPages,
      currentPage,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


// GET A PRODUCT

const GetSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { currency } = req.query;

    const cacheKey = `product:${productId}:currency=${currency || "NGN"}`;

    const cachedProduct = await redisClient.get(cacheKey);

    if (cachedProduct) {
      return res.status(200).json({
        message: "Product retrieved successfully (from cache)",
        product: JSON.parse(cachedProduct),
      });
    }

    const product = await Product.findOne({ where: { id: productId } });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let convertedPrice = product.price;

    if (currency && currency !== "NGN") {
      convertedPrice = await convertCurrency(product.price, "NGN", currency);
    }

    const productData = {
      ...product.toJSON(),
      price: convertedPrice,
      currency: currency || "NGN",
    };

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(productData));

    return res.status(200).json({
      message: "Product retrieved successfully",
      product: productData,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// EDIT PRODUCT
const UpdateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const [updatedRows, [updatedProduct]] = await Product.update(req.body, {
      where: { id: productId },
      returning: true,
    });

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// DELETE PRODUCT
const DeleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const deletedProduct = await Product.destroy({ where: { id: productId } });

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  AdminRegister,
  VendorRegister,
  Login,
  CreateStore,
  DeleteUser,
  GetAllUsers,
  UpdateUserPassword,
  GetSingleUser,
  AddNewProduct,
  GetAllProducts,
  GetSingleProduct,
  DeleteProduct,
  UpdateProduct,
  Logout,
};
