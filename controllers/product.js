import express from "express";
import Product from "../models/product.js";

const router = express.Router();
router.get("/", async (req, res) => {
    var ProductModel = await Product();
    const product = await ProductModel.findAll();
    console.log(product);
    res.send();

});

router.post("/", async (req, res) => {
    var data = req.body;
    var ProductData = {
        productname: data.productname,
        productno: data.productno,
        quantity: data.quantity,
        price: data.price,
    };
    var ProductModel = await Product();
    const product = await ProductModel.create(ProductData);
    console.log(product);
    res.send();
});

export default router;
