const Joi =require ("joi");
const bcrypt =require  ('bcrypt');
const jwt = require('jsonwebtoken');
const {appSecret} = require('../config/index')
const payload = require ('../dto/user.dto')
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  try {
    const apiKey = process.env.API_KEY; 
    const apiUrl = `${process.env.API_URL}/${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;

    const response = await axios.get(apiUrl);
    const convertedAmount = response.data.conversion_result;

    return convertedAmount;
  } catch (error) {
    console.error("Error fetching currency conversion:", error);
    throw new Error("Unable to fetch currency conversion data");
  }
};

const registerSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});


const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(), 
  quantity: Joi.number().integer().min(0).required(), 
  category: Joi.string().required(),
});






const option = {
  abortEarly: false,
  // allowUnknown: true,
  // stripUnknown: true,
  errors: {
    wrap: {
      label: ''
    }
  }
};
const GenerateSalt = async (rounds) => {

  try {
    const salt = await bcrypt.genSalt(10);
    return salt;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const GeneratePassword = async (password ,salt) => {

  try {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const GenerateToken = async (payload) =>
{
  return jwt.sign(payload,  appSecret, {expiresIn: '1d'})   
}

 const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});







module.exports = {
  registerSchema,
  option,
  GeneratePassword,
  GenerateSalt,
  loginSchema,
  GenerateToken,
  productSchema,
  convertCurrency,
};