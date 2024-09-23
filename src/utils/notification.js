const nodemailer = require("nodemailer");
const {
  FromAdminMail,
  userSubject,
  APP_PASSWORD,
  APP_EMAIL,
} = require("../config");

// const transport = nodemailer.createTransport({
//   service: "gmail" /*service and host are the same thing */,
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });
const transport = nodemailer.createTransport({
  host: "smtp.zoho.com",
  auth: {
    user: APP_EMAIL,
    pass: APP_PASSWORD,
  },
  port: 465,
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
});

const mailSent = async (from, to, subject, html) => {
  try {
    const response = await transport.sendMail({
      from: FromAdminMail,
      to,
      subject: userSubject,
      html,
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};
const emailHtml2 = (link) => {
  let response = `
    <div style="max-width:700px;
    margin:auto;
    border:10px solid #ddd;
    padding:50px 20px;
    font-size: 110%;
    font-style: italics
    "> 
    <h2 style="text-align:center;
    text-transform:uppercase;
    color:teal;
    ">
    Express Online
    </h2>
    <p>Hi there, follow the link to reset your password. The link expires in 10 minutes below.</p>
     <a href=${link}>Reset Password</a>
     <h3>DO NOT DISCLOSE TO ANYONE<h3>
     </div>`;

  return response;
};
const sentMail = async (from, to, subject, html) => {
  try {
    const response = await transport.sendMail({
      from: FromAdminMail,
      to,
      subject,
      html,
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};
const emailHtml = (newOrder) => {
  // Extract products and quantities from the newOrder object
  const { products } = newOrder;

  const productsHtml = `
 
   
  <table style= "border-collapse: collapse;
      width: 100%;">
    <thead style= "border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;">
      <tr>
        <th style= "border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;background-color: #f2f2f2;
      ">Product</th>
        <th style= "border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;background-color: #f2f2f2;
      ">Quantity</th>
        <th style= "border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
      background-color: #f2f2f2;
      ">Amount(per Item)</th>
      </tr>
    </thead>
    <tbody>
      ${products
        .map(
          (product) => `
          <tr>
            <td style= "background-color: #f2f2f2;">${product.name}</td>
            <td style= "background-color: #f2f2f2;">${product.quantity}</td>
            <td style= "background-color: #f2f2f2;">${product.amount}</td>
          </tr>
        `
        )
        .join("")}
    </tbody>
  </table>
`;

  const response = `
    <div style="max-width:700px;
    margin:auto;
    border:10px solid #ddd;
    padding:50px 20px;
    font-size: 110%;
    font-style: italic;
    ">
      <h2 style="text-align:center;
      text-transform:uppercase;
      color:red;
      ">
        ORDER DETAILS
      </h2>
      <h3>Hi, </br> Your order <strong>(ID: ${newOrder.orderNumber})</strong> details are as shown below:</h2> </br>
      ${productsHtml} </hr>
      <h3><strong>TOTAL: ${newOrder.totalAmount}</strong></h3>
    </div>
  `;

  return response;
};

const emailHtml1 = (updatedOrder) => {
  let response = `
    <div style="max-width:700px;
    margin:auto;
    border:10px solid #ddd;
    padding:50px 20px;
    font-size: 110%;
    font-style: italics
    "> 
    <h2 style="text-align:center;
    text-transform:uppercase;
    color:teal;
    ">
    PEARMONIE
    </h2>
    <p>Hi, You have successfully made payment of ₦${updatedOrder.totalAmount} for Order (ID: ${updatedOrder.orderNumber})
     </div>`;

  return response;
};
module.exports = { mailSent, emailHtml2, sentMail, emailHtml, emailHtml1 };
