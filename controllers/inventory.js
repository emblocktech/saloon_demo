import express from "express";
import Inventory from "../models/inventory.js";

const router = express.Router();
router.get("/", async (req, res) => {
    var InventoryModel = await Inventory();
    const stock = await InventoryModel.findAll();
    console.log(stock);
    res.send();

});

router.post("/", async (req, res) => {
    var data = req.body;
    var inventoryData = {
        itemname: data.itemname,
        quantityincrease: data.quantityincrease,
        currentquantity: data.currentquantity,
    };
    var InventoryModel = await Inventory();
    const stock = await InventoryModel.create(inventoryData);
    console.log(stock);
    res.send();

});

export default router;
