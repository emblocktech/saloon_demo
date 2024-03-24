import express from "express";
import getCustomerTransactionModel from "../models/customerTransaction.js";

const router = express.Router();

// Create operation - POST /customerTransactions
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
    } = req.body;
    const transactionData = {
      empID: empID,
      customerName: customerName,
      customerPhoneNo: customerPhoneNo,
      customerPoints: customerPoints,
      billNo: billNo,
      billAmount: billAmount,
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
