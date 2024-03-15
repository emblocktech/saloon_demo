import express from "express";
import getProductTransactionModel from "../models/productTransaction.js";

const router = express.Router();

// Create operation - POST /productTransactions
router.post("/", async (req, res) => {
  try {
    const ProductTransaction = await getProductTransactionModel();
    const { empID, itemNo, itemName, quantity, billNo } = req.body;
    const transactionData = {
      empID: empID,
      itemNo: itemNo,
      itemName: itemName,
      quantity: quantity,
      billNo: billNo,
    };

    const transaction = await ProductTransaction.create(transactionData);

    res.status(201).json({
      success: true,
      message: "Product transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error creating product transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Other CRUD operations can be added similarly

export default router;
