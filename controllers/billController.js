import express from 'express';
import getUserModel from '../models/customer.js';
import getProductModel from '../models/product.js';
import getCustomerModel from '../models/customer.js'
import getCustomerTransactionModel from '../models/customerTransaction.js';
import getProductTransactionModel from '../models/productTransaction.js';
import getPosMarinaModel from '../models/posmarina.js';
import getAppInfoModel from '../models/appinfo.js';
import nodemailer from "nodemailer";
import fs from "fs";
import ejs from "ejs";
import puppeteer from 'puppeteer';
import constants from '../constants.js';

const router = express.Router();

router.get("/count/total", async (req, res) => {
	const AppInfo = await getAppInfoModel();
	let id = req.headers.location === "OMR" ? 1 : 2
	const app = await AppInfo.findByPk(id);
	res.status(200).json({ success: true, billCount: app.dataValues.totBill })
})

router.get("/download/:location/:billno", async (req,res) =>{
  const generate = async (html, location) => {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html)
    const pdfBuffer = await page.pdf({
      width: '1000px',
      height: '1200px',
    })
  
    await browser.close();
    return pdfBuffer;
  }
  const billNo = req.params.billno;
  const location = req.params.location;

  // get userInfo
  const CustomerTransaction  = await getCustomerTransactionModel();
  const custTransaction = (await CustomerTransaction.findAll({where:{billNo:billNo,location:location}}))[0]
  const date = custTransaction.createdAt;
  const CustomerInfo = await getCustomerModel();
  const {emailId} = (await CustomerInfo.findAll({attributes:['emailId'],where:{
                                                                              customername:custTransaction.customerName,
                                                                              phonenumber:custTransaction.customerPhoneNo
                                                                            }
    }))[0];
  const userInfo = {
    moblieNumber: custTransaction.customerPhoneNo,
    mailID: emailId,
    name: custTransaction.customerName,
    address: ""
  }

  // get product details
  const ProductTransaction = await getProductTransactionModel()
  const prdTrans = await ProductTransaction.findAll({where:{billNo:billNo,location:location}}) 
  const Product = await getProductModel();
  const prices = await Product.findAll({attributes:['id','itemNo','itemName','price'],where:{itemNo:prdTrans.map((a)=>a.itemNo)}})
  const bill =  prdTrans.map((val) => {
    prices.forEach(e=>{
      if (e.itemNo.toLowerCase() === val.itemNo.toLowerCase()){
        if (val.price){
          if (e.itemName.toLowerCase() === val.itemNo.toLowerCase()){
            val.price = e.price;
          }
        }else{
          val.price = e.price;
        }
      }
    })
    try{
      val.disc = (JSON.parse(val.parameter)).disc ?? 0;
    }catch{
      val.disc=0;
    }
    val.amount = val.price - val.disc; 
    val.gst = val.amount*0.18;

    ["price","amount","disc","gst"].forEach(i=>{
      val[i] = parseFloat(val[i]).toFixed(2) ?? "cannot get data";
    });

    return {
      productName: val.itemName,
      productQuantity: val.quantity,
      productPrice: val.price,
      productDiscount: val.disc,
      productGst: val.gst,
      productAmount: val.amount
    };
  })
  const billAmount = custTransaction.billAmount;
  const data = {
    paymentInfo: {
      paymentMethod: "COD",
      taxInvoiceNumber: "IT2023001",
      gstNumber: "GL-0001-0002-0003",
      purchaseDate: date.toDateString(),
      orderTime: date.toLocaleTimeString(),
      retailerContactNumber1: "987654321",
      retailerContactNumber2: "4567890123",
      retailerMailId: "retailer@example.com",
    },
    paySummary: {
      gstTotal: parseFloat(billAmount * 0.18).toFixed(2),
      amountTotal: parseFloat(billAmount).toFixed(2),
      details: bill,
    },
  };

  // rendering html then to pdf and send to client
  ejs.renderFile("./bill_template.ejs",  { ...data, userInfo }, async (err, html) => {
    try{
      const pdfBuffer = await generate(html, location);
      res.contentType("application/pdf");
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error processing billing data:", error);
      res.status(500).json({ error: "ERROR processing bill" });
    }
  })
})
router.post("/", async (req, res) => {

  try {
    // Extract data from request body
    const {
      empID,
      customerName,
      customerPhoneNo,
      customerPoints,
      emailId,
      billNo,
      billAmount,
      totGST,
      totDisc,
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
    let posmarina = await getPosMarinaModel();
    for (const item of bill) {
      const { itemNo, quantity } = item;


      const product = await Product.findOne({ where: { itemNo } });
      if (product) {
        await product.update({
          quantity: product.quantity - quantity,
          sold: parseInt(product.sold) + parseInt(quantity)
        });

        let a = {}
        if (!item.discAmt) {
          a = JSON.parse(product.parameter);
          a.disc = 0;
        } else {
          a = JSON.parse(product.parameter);
          a.disc = parseFloat(item.discAmt.amt) 
        }
        

        // Log product transaction
        await ProductTransaction.create({
          empID,
          itemNo,
          itemName: item.itemName,
          quantity,
          billNo,
		  category: product.category,
		  parameter: JSON.stringify(a),
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
		  parameter: JSON.stringify({
        disc: item.discAmt ? parseFloat(item.discAmt.amt) : 0,
      }),
		  location
        });
      }
    }

    let currentDatePos = new Date()
    if (location === "OMR") {
      await posmarina.create({
        receipt_no: billNo,
        timestamp: currentDatePos,
        inv_amt: parseInt(billAmount),
        tax_amt: totGST,
        dis_amt: totDisc,
        net_amt: billAmount + totDisc
      })
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
			"gstTotal": parseFloat(totGST).toFixed(2),
			"amountTotal": parseFloat(billAmount).toFixed(2),
			"details": bill.map((val) => ({
				productName: val.itemName,
				productQuantity: val.quantity,
				productPrice: parseFloat(val.price).toFixed(2),
				productDiscount: parseFloat(val.disc).toFixed(2),
				productGst: parseFloat(val.gst).toFixed(2),
				productAmount: parseFloat(val.amount).toFixed(2)
			}))
		}}
		
	const userInfo = {
		moblieNumber: customer.phonenumber,
		mailID: customer.emailId,
		name: customer.customername,
		address: ""
	}
	
	ejs.renderFile("./bill_template.ejs",  { ...data, userInfo }, async (err, html) => {
    const generate = async (html, location) => {
      const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
      const page = await browser.newPage();
      await page.setContent(html)
      const path = `./generated_docs/test_${location}.pdf`;
      await page.pdf({
        path: path,
        width: '1000px',
        height: '1200px',
        
      })

      await browser.close();
      return path;
    }
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
