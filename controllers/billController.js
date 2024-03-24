import express from 'express';
import getUserModel from '../models/customer.js';
import getProductModel from '../models/product.js';
import getCustomerTransactionModel from '../models/customerTransaction.js';
import getProductTransactionModel from '../models/productTransaction.js';

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // Extract data from request body
    const {
      empID,
      customerName,
      customerPhoneNo,
      customerPoints,
      billNo,
      billAmount,
      bill
    } = req.body;

    // Update customer points
    const Customer = await getUserModel();
    const [customer, created] = await Customer.findOrCreate({
      where: { phonenumber: customerPhoneNo },
      defaults: {
        customername: customerName,
        points: customerPoints
      }
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
          billNo
        });
      }
    }

    // Log customer transaction
    const CustomerTransaction = await getCustomerTransactionModel();
    await CustomerTransaction.create({
      empID,
      customerName,
      customerPhoneNo,
      customerPoints,
      billNo,
      billAmount
    });

    res.status(200).json({ success: true, message: "Billing data processed successfully" });
  } catch (error) {
    console.error("Error processing billing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
