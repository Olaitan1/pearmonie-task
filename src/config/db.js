const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const db = new Sequelize(process.env.DB_CONNECTION_STRING, {
  logging: false, 
  dialectOptions: {
    ssl:
      { require: true, rejectUnauthorized: false }
   
  },
});

const connectDB = async () => {
    try
    {
        await db.authenticate(); 
        await db.sync(); 
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { connectDB, db };
