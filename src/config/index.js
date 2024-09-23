const dotenv = require("dotenv");
dotenv.config();


const redis = require("redis");
(async () => {
  redisClient = redis.createClient();
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  await redisClient.connect();
})();


module.exports = {
  redisClient,
  appSecret: process.env.appSecret,
  cloud_name: process.env.cloud_name,
  api_key: process.env.API_KEY,
  api_secret: process.env.api_secret,
  FromAdminMail: process.env.FromAdminMail,
  userSubject: process.env.userSubject,
  GMAIL_PASS: process.env.GMAIL_PASS,
  GMAIL_USER: process.env.GMAIL_USER,
  APP_EMAIL: process.env.APP_EMAIL,
  APP_PASSWORD: process.env.APP_PASSWORD,
  
};
