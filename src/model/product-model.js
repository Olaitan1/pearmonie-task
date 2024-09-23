const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const Product = db.define("Product", {
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
  description: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
  },
  store_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Stores",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
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
Product.associate = (models) => {
  Product.belongsTo(models.Store, { foreignKey: "store_id" });
  Product.belongsTo(models.User, { foreignKey: "user_id" });
};

module.exports = Product;
