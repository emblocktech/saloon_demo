// import express from "express";
// import Transaction from "../models/transaction.js";

// const router = express.Router();

// // Read operation - GET /transactions
// router.get("/", async (req, res) => {
//   try {
//     const transactionModel = await Transaction();
//     const transactions = await transactionModel.findAll();
//     res.status(200).json({
//       success: true,
//       message: "Transactions fetched successfully",
//       data: transactions,
//     });
//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
// // Create operation - POST /transactions
// router.post("/", async (req, res) => {
//   try {
//     const data = req.body;
//     const transactionModel = await Transaction();
//     // Iterate through each item in the bill array and create a transaction for each item
//     for (const item of data.bill) {
//       const transactionData = {
//         billNo: data.billNo,
//         empID: data.empID,
//         customerPhoneNo: data.customerPhoneNo,
//         customerName: data.customerName,
//         itemName: item.itemName, // Added itemName
//         quantity: item.quantity,
//         price: item.price,
//         discount: item.discount,
//         amount: item.amount,
//       };
//       await transactionModel.create(transactionData);
//     }
//     res.status(201).json({
//       success: true,
//       message: "Transactions created successfully",
//     });
//   } catch (error) {
//     console.error("Error creating transactions:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Update operation - PUT /transactions/:id
// router.put("/:id", async (req, res) => {
//   try {
//     const transactionModel = await Transaction();
//     const transactionId = req.params.id;
//     const data = req.body;
//     const updatedRows = await transactionModel.update(data, {
//       where: { id: transactionId },
//     });
//     if (updatedRows[0] === 1) {
//       const updatedTransaction = await transactionModel.findByPk(transactionId);
//       res.status(200).json({
//         success: true,
//         message: "Transaction updated successfully",
//         data: updatedTransaction,
//       });
//     } else {
//       res.status(404).json({ error: "Transaction not found" });
//     }
//   } catch (error) {
//     console.error("Error updating transaction:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Delete operation - DELETE /transactions/:id
// router.delete("/:id", async (req, res) => {
//   try {
//     const transactionModel = await Transaction();
//     const transactionId = req.params.id;
//     const deletedRowCount = await transactionModel.destroy({
//       where: { id: transactionId },
//     });
//     if (deletedRowCount === 1) {
//       res
//         .status(200)
//         .json({ success: true, message: "Transaction deleted successfully" });
//     } else {
//       res.status(404).json({ error: "Transaction not found" });
//     }
//   } catch (error) {
//     console.error("Error deleting transaction:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// export default router;
