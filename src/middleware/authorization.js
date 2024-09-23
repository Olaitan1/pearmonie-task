const jwt = require('jsonwebtoken');
const {appSecret} = require('../config/index')
const User = require('../model/user-model');



const protect = async (req, res, next) => {
  let token = "";

  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 401,
      message: "Not authorized, you have no access token, please login",
    });
  }

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        const { id } = jwt.verify(token, appSecret || "");
    const user = await User.findOne({ where: { id } });

      if (!user) {
        throw new Error("Not Authorized");
      }

      req.user = user;
      next();
    } else {
      throw new Error("Invalid token format");
    }
  } catch (error)
  {
    return res.status(401).json({
      error: error.message,
        message: "You are not a valid user, please login",
      
    } );
      
  }
};


const Vendor = (req, res, next) => {
  if (req.user && req.user.role === "user") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Not authorized to perform this action" });
  }
};

const Admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({
        message:
          "Not authorized to perform this action",
      });
  }
};

module.exports = { protect, Vendor, Admin};