const { DataTypes } = require("sequelize");
const { db } = require("../config/db");
const Product = require("./product-model");
const User = require("./user-model"); 

const Store = db.define("Store", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Store.hasMany(Product, {
  foreignKey: "store_id",
  onDelete: "CASCADE",
});

Product.belongsTo(Store, {
  foreignKey: "store_id",
});

Store.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE", 
});


User.hasMany(Store, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});


module.exports = Store;
