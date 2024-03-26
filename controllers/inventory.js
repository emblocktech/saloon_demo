import express from "express";
import Inventory from "../models/inventory.js";

const router = express.Router();

// Read operation - GET /inventory
router.get("/", async (req, res) => {
  try {
    const inventoryModel = await Inventory();
    const stock = await inventoryModel.findAll();
    res.status(200).json({
      success: true,
      message: "Stock fetched successfully",
      data: stock,
    });
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create operation - POST /inventory
router.post("/", async (req, res) => {
  try {
    const inventoryModel = await Inventory();
    const data = req.body;
    const inventoryData = {
      itemno: data.itemno,
      itemname: data.itemname,
      parameter: data.parameter,
      category: data.category,
      sold: data.sold,
      available: data.available,
      location: data.location,
    };
    const stock = await inventoryModel.create(inventoryData);
    res.status(201).json({
      success: true,
      message: "Stock created successfully",
      data: stock,
    });
  } catch (error) {
    console.error("Error creating stock:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update operation - PUT /inventory/:id
router.put("/:id", async (req, res) => {
  try {
    const inventoryModel = await Inventory();
    const inventoryId = req.params.id;
    const data = req.body;
    const updatedRows = await inventoryModel.update(data, {
      where: { id: inventoryId },
    });
    if (updatedRows[0] === 1) {
      const updatedStock = await inventoryModel.findByPk(inventoryId);
      res.status(200).json({
        success: true,
        message: "Stock updated successfully",
        data: updatedStock,
      });
    } else {
      res.status(404).json({ error: "Stock not found" });
    }
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete operation - DELETE /inventory/:id
router.delete("/:id", async (req, res) => {
  try {
    const inventoryModel = await Inventory();
    const inventoryId = req.params.id;
    const deletedRowCount = await inventoryModel.destroy({
      where: { id: inventoryId },
    });
    if (deletedRowCount === 1) {
      res
        .status(200)
        .json({ success: true, message: "Stock deleted successfully" });
    } else {
      res.status(404).json({ error: "Stock not found" });
    }
  } catch (error) {
    console.error("Error deleting stock:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
