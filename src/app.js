const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoute = require("./routes/user");
const postRoute = require("./routes/product");
const Swagger = require("./utils/swagger");
const dotenv = require("dotenv");
const os = require("os");
const db = require("./config");
const { connectDB } = require("./config/db");

dotenv.config();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());

Swagger(app);

connectDB();
app.use("/api", authRoute);
app.use("/products", postRoute);

// Function to get the IP address
const getIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName];
    for (const interfaceDetail of interfaceInfo) {
      // Skip loopback and non-IPv4 addresses
      if (!interfaceDetail.internal && interfaceDetail.family === "IPv4") {
        return interfaceDetail.address;
      }
    }
  }
  return undefined;
};

app.get("/", (req, res) => {
  const myIPAddress = getIPAddress();
  // const myIPAddress =
  //     req.headers["cf-connecting-ip"] ||
  //     req.headers["x-real-ip"] ||
  //     req.headers["x-forwarded-for"] ||
  //     req.socket.remoteAddress || '';

  res.json(myIPAddress);
});
app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});
