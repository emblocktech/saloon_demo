import express from "express";
import getCustomerTransactionModel from "../models/customerTransaction.js";
import getProductTransactionModel from "../models/productTransaction.js";
import ExcelJS from "exceljs";
import { Op, literal } from "sequelize"
import _ from "lodash"

const router = express.Router();

// Create operation - POST /customerTransactions

router.get("/", async (req, res) => {
	 try {
	 	const CustomerTransaction = await getCustomerTransactionModel();
		 const transaction = await CustomerTransaction.findAll();
		 
		 res.status(201).json({
		  success: true,
		  message: "Done",
		  trans: transaction,
		});
	 } catch (err) {
	 	 console.error("Error fetching customer transaction:", error);
    	 res.status(500).json({ error: "Internal server error" });
	 }
	
})

router.get("/download/report/:from/:to", async (req, res) => {
	const from = req.params.from
  	const to = req.params.to
	 try {
	 	 const startDate = new Date(`${from}T00:00:00.000Z`);
    	 const endDate = new Date(`${to}T18:29:00.000Z`);

    	 console.log(startDate, endDate)

	 	 const CustomerTransaction = await getCustomerTransactionModel();
	 	 const ProductTransaction = await getProductTransactionModel();
	 	 const product = await ProductTransaction.findAll({ where:{ createdAt: { [Op.between]: [startDate, endDate] } }})
		 const transaction = await CustomerTransaction.findAll({ where:{ createdAt: { [Op.between]: [startDate, endDate] } }});
		 const plainProduct = product.map(el => el.get({ plain: true }))
		 
		 const billGrouped = _.groupBy(plainProduct, 'billNo')
		 console.log(billGrouped)
		 const workbook = new ExcelJS.Workbook();
    	 const sheet = workbook.addWorksheet('Reports');
    	 
    	 const transDetails = []
    	 let total = 0;
    
		transaction.map((val, ind) => {
		    const sno = ind + 1;
		    const customer_name = val.dataValues.customerName;
		    const customer_phno = val.dataValues.customerPhoneNo;
		    const credit_point = val.dataValues.customerPoints
		    const cashier = val.dataValues.empID
		    const location = val.dataValues.location
		    const modeOfPay = val.dataValues.modeOfPay
		    const amount = val.dataValues.billAmount
		    const billNo = val.dataValues.billNo
		    const productIDs = billGrouped[val.dataValues.billNo].map((val) => val.itemNo)
		    const productNames = billGrouped[val.dataValues.billNo].map((val) => val.itemName)
		    const details = {s_no: sno, customer_name: customer_name, customer_phno: customer_phno, credit_point: credit_point, cashier: cashier, productIDs: productIDs, productNames: productNames, location: location, billNo: billNo, modeOfPay: modeOfPay, amount: amount}
		    transDetails.push(details)
		    total = total + amount;
		  })
		
		sheet.columns = [
		    { header: "S.NO", key: "s_no", width: 10 },
		    { header: "Customer Name", key: "customer_name", width: 25 },
		    { header: "Customer Number", key: "customer_phno", width: 25 },
		    { header: "Credit Point", key: "credit_point", width: 25 },
		    { header: "Cashier", key: "cashier", width: 25 },
		    { header: "Product IDs", key: "productIDs", width: 25 },
		    { header: "Product Names", key: "productNames", width: 25 },
		    { header: "Location", key: "location", width: 25 },
		    { header: "Bill No", key: "billNo", width: 25 },
		    { header: "Mode Of pay", key: "modeOfPay", width: 25 },
		    { header: "Amount", key: "amount", width: 25 }
		  ]
		  transDetails.map((val) => {
		    sheet.addRow(val)
		  })


		  sheet.addRow({
		  	s_no: "", customer_name: "", customer_phno: "", credit_point: "", cashier: "", productIDs: "", productNames: "", location: "", billNo: "", modeOfPay: "Total", amount: total
		  })

		  sheet.getRow(1).eachCell((cell) => {
		        cell.font = { bold: true, size:12 };            
		  });
		  sheet.getRow(1).fill = {
		      type: 'pattern',
		      pattern:'solid',
		      fgColor:{argb:'0766AD'}
		  };
	  
		  var fileName = 'transaction_report.xlsx';
		  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		  res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
		  await workbook.xlsx.write(res);  
			 
	 } catch (err) {
	 	 console.error("Error fetching customer transaction:", err);
    	 res.status(500).json({ error: "Internal server error" });
	 }
	
})
router.get("/report/:from/:to", async (req, res) => {
	const from = req.params.from
  	const to = req.params.to
	 try {
	 	 const startDate = new Date(`${from}T00:00:00.000Z`);
    	 const endDate = new Date(`${to}T18:29:00.000Z`);

    	 console.log(startDate, endDate)

	 	 const CustomerTransaction = await getCustomerTransactionModel();
	 	 const ProductTransaction = await getProductTransactionModel();
		 if (startDate){
			var product = await ProductTransaction.findAll({ where: { createdAt: { [Op.between]: [startDate, endDate] } } });
			var transaction = await CustomerTransaction.findAll({ where: { createdAt: { [Op.between]: [startDate, endDate] } } });
		 } else {
			var product = await ProductTransaction.findAll({ where: { createdAt: { [Op.between]: [startDate, endDate] } } });
			var transaction = await CustomerTransaction.findAll({ where: { createdAt: { [Op.between]: [startDate, endDate] } } });
		 }
		 const plainProduct = product.map(el => el.get({ plain: true }))
		 
		 const billGrouped = _.groupBy(plainProduct, 'billNo')
		 console.log(billGrouped)
		 const workbook = new ExcelJS.Workbook();
    	 const sheet = workbook.addWorksheet('Reports');
    	 
    	 const transDetails = []
    	 let total = 0;
    
		transaction.map((val, ind) => {
		    const sno = ind + 1;
		    const customer_name = val.dataValues.customerName;
		    const customer_phno = val.dataValues.customerPhoneNo;
		    const credit_point = val.dataValues.customerPoints
		    const location = val.dataValues.location
		    const modeOfPay = val.dataValues.modeOfPay
		    const amount = val.dataValues.billAmount
		    const billNo = val.dataValues.billNo
			const details = { id: sno, customerName: customer_name, customerPhoneNo: customer_phno, customerPoints: credit_point, location: location, billNo: billNo, modeOfPay: modeOfPay, billAmount: amount, createdAt: val.dataValues.createdAt };
		    transDetails.push(details)
		    total = total + amount;
		  })
		
		  res.setHeader('Content-Type', 'application/json');
		 res.json(transDetails);
			 
	 } catch (err) {
	 	 console.error("Error fetching customer transaction:", err);
    	 res.status(500).json({ error: "Internal server error" });
	 }
	
})

router.post("/", async (req, res) => {
  try {
    const CustomerTransaction = await getCustomerTransactionModel();
    const {
      empID,
      customerName,
      customerPhoneNo,
      customerPoints,
      billNo,
      billAmount,
      location,
      modeOfPay
    } = req.body;
    const transactionData = {
      empID: empID,
      customerName: customerName,
      customerPhoneNo: customerPhoneNo,
      customerPoints: customerPoints,
      billNo: billNo,
      billAmount: billAmount,
      location: location,
      modeOfPay: modeOfPay
    };

    const transaction = await CustomerTransaction.create(transactionData);

    res.status(201).json({
      success: true,
      message: "Customer transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error creating customer transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Other CRUD operations can be added similarly

export default router;

