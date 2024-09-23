const User = require("./user-model"); 
const Store = require("./store-model");

User.hasMany(Store, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Store.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = { User, Store };
