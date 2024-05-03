import express from 'express';
import getUserModel from '../models/customer.js';
import getProductModel from '../models/product.js';
import getCustomerTransactionModel from '../models/customerTransaction.js';
import getProductTransactionModel from '../models/productTransaction.js';
import getAppInfoModel from '../models/appinfo.js';
import nodemailer from "nodemailer";
import fs from "fs";
import ejs from "ejs";
import path from "path";
import puppeteer from 'puppeteer';
import constants from '../constants.js';

const router = express.Router();

router.get("/count/total", async (req, res) => {
	
	const AppInfo = await getAppInfoModel();
	let id = req.headers.location === "OMR" ? 1 : 2
	const app = await AppInfo.findByPk(id);
	res.status(200).json({ success: true, billCount: app.dataValues.totBill })
})

router.post("/", async (req, res) => {

  const generate = async (html, location) => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(html)
  
    await page.pdf({
      path: `./generated_docs/test_${location}.pdf`,
      width: '1000px',
      height: '1200px',
      
    })

    await browser.close();
  
  }
  try {
    // Extract data from request body
    console.log(req.body)
    const {
      empID,
      customerName,
      customerPhoneNo,
      customerPoints,
      emailId,
      billNo,
      billAmount,
      totGST,
      bill,
      modeOfPay,
      location,
      billDate
    } = req.body;
    
    //Update Bill Count

    
  const AppInfo = await getAppInfoModel();
  let id = req.headers.location === "OMR" ? 1 : 2
	const app = await AppInfo.findByPk(id)
	let cnt = app.dataValues.totBill + 1;
	await app.update({ totBill: cnt })

    // Update customer points
    const Customer = await getUserModel();
    
    const [customer, created] = await Customer.findOrCreate({
      where: { phonenumber: customerPhoneNo },
    });
    await customer.update({ points: customerPoints });

    // Update product quantities and sold quantities, and log transactions
    const Product = await getProductModel();
    const ProductTransaction = await getProductTransactionModel();
    for (const item of bill) {
      const { itemNo, quantity } = item;

      const product = await Product.findOne({ where: { itemNo } });
      if (product) {
        await product.update({
          quantity: product.quantity - quantity,
          sold: parseInt(product.sold) + parseInt(quantity)
        });

        // Log product transaction
        await ProductTransaction.create({
          empID,
          itemNo,
          itemName: item.itemName,
          quantity,
          billNo,
		  category: product.category,
		  parameter: product.parameter,
		  location
        });
      } else {
      	await ProductTransaction.create({
          empID,
          itemNo,
          itemName: item.itemName,
          quantity,
          billNo,
		  category: "New",
		  parameter: "New",
		  location
        });
      }
    }
    

    // Log customer transaction
    const CustomerTransaction = await getCustomerTransactionModel();
    let trans = await CustomerTransaction.create({
      empID,
      customerName,
      customerPhoneNo,
      customerPoints,
      billNo,
      billAmount,
      modeOfPay,
      location
    });


    if (billDate) {
        await CustomerTransaction.update({ createdAt: new Date(billDate) }, { where: { id: trans.dataValues.id } })
    }
    
    const transporter = nodemailer.createTransport({
	  service: "Gmail",
	  host: "smtp.gmail.com",
	  port: 465,
	  secure: true,
	  auth: {
		user: constants.MAIL_TEST.mail,
		pass: constants.MAIL_TEST.pass,
	  },
	});
	
	const date = new Date()
	
	const data = {
		  "paymentInfo": {
			"paymentMethod": "COD",
			"taxInvoiceNumber": "IT2023001",
			"gstNumber": "GL-0001-0002-0003",
			"purchaseDate": date.toDateString(),
			"orderTime": date.toLocaleTimeString(),
			"retailerContactNumber1": "987654321",
			"retailerContactNumber2": "4567890123",
			"retailerMailId": "retailer@example.com"
			},
		  "paySummary": {
			"gstTotal": totGST,
			"amountTotal": billAmount,
			"details": bill.map((val) => ({
				productName: val.itemName,
				productQuantity: val.quantity,
				productPrice: val.price,
				productDiscount: val.disc,
				productGst: val.gst,
				productAmount: val.amount
			}))
		}}
		
	const userInfo = {
		moblieNumber: customer.phonenumber,
		mailID: customer.emailId,
		name: customer.customername,
		address: ""
	}
	
	ejs.renderFile("./bill_template.ejs",  { ...data, userInfo }, async (err, html) => {

    await generate(html, location);

		const mailOptions = {
		  from: "femigamarina@gmail.com",
		  to: customer.emailId,
		  subject: "Bill Information",
		  html: '<h1>FEMIGA</h1><p>Find the details of the bill below:</p>', attachments: [
        {
            filename: 'Bill.pdf',
            path: `./generated_docs/test_${location}.pdf`,
            cid: 'uniq_bill'
        }
      ],
		};
		
		transporter.sendMail(mailOptions, (error, info) => {
		  if (error) {
			console.error("Error sending email: ", error);
		  } else {
			console.log("Email sent: ", info.response);
		  }
		});
	})
	

    res.status(200).json({ success: true, message: "Billing data processed successfully" });
  } catch (error) {
    console.error("Error processing billing data:", error);
    res.status(500).json({ error: "Please fill all the values" });
  }
});

export default router;
