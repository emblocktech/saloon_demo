import express from "express";
import getPosMarinaModel from "../models/posmarina.js";

const router = express.Router();

router.get("/", async (req, res) => {
	 try {
	 	const posMarina = await getPosMarinaModel();
		 const transaction = await posMarina.findAll();

		 res.status(201).json({
		  success: true,
		  message: "Done",
		  trans: transaction,
		});
	 } catch (err) {
	 	 console.error("Error fetching transaction:", error);
    	 res.status(500).json({ error: "Internal server error" });
	 }
})

// Create operation - POST /productTransactions
router.post("/", async (req, res) => {
  try {
    const posMarina = await getPosMarinaModel();
    const { receipt_no, timestamp, inv_amt, tax_amt, dis_amt, net_amt } = req.body;
    const transactionData = {
      receipt_no: receipt_no,
      timestamp: timestamp,
      inv_amt: inv_amt,
      tax_amt: tax_amt,
      dis_amt: dis_amt,
      net_amt: net_amt,
    };

    const transaction = await posMarina.create(transactionData);

    res.status(201).json({
      success: true,
      message: "transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Other CRUD operations can be added similarly

export default router;
