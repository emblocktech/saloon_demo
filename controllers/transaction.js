import express from "express";
import Transaction from "../models/transaction.js";

const router = express.Router();
router.get("/", async (req, res) => {
    var TransactionModel = await Transaction();
    const transaction = await TransactionModel.findAll();
    console.log(transaction);
    res.send();

});

router.post("/", async (req, res) => {
    var data = req.body;
    var TransactionData = {
        itemname: data.itemname,
        quantity: data.quantity,
        price: data.price,
        gst: data.gst,
        amount: data.amount,
    };
    var TransactionModel = await Transaction();
    const transaction = await TransactionModel.create(TransactionData);
    console.log(transaction);
    res.send();

});

export default router;
