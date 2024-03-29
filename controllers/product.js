import express from "express";
import Product from "../models/product.js";

const router = express.Router();

// Read operation - GET /products
router.get("/", async (req, res) => {
  try {
    const productModel = await Product();
    const products = await productModel.findAll();
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create operation - POST /products
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const productData = {
      itemNo: data.itemNo,
      itemName: data.itemName,
      quantity: data.quantity,
      price: data.price,
      sold: data.sold,
      discount: data.discount || 0, // Set discount to 0 if not provided
    };
    const productModel = await Product();
    const product = await productModel.create(productData);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Update operation - PUT /products
router.put("/", async (req, res) => {
  try {
    const productModel = await Product();
    const updateItems = req.body;

    // Array to store promises for updating each item
    const updatePromises = updateItems.map(async (item) => {
      const { itemNo, quantity, price } = item;
      const [updatedRows] = await productModel.update({ quantity, price }, {
        where: { itemNo: itemNo }, // Use itemNo in the where clause
      });
      return { itemNo, updatedRows };
    });

    // Wait for all update operations to complete
    const results = await Promise.all(updatePromises);

    // Check if any items were updated successfully
    const updatedProducts = results.filter(result => result.updatedRows === 1);

    if (updatedProducts.length > 0) {
      res.status(200).json({
        success: true,
        message: "Products updated successfully",
        updatedProducts: updatedProducts.map(result => result.itemNo),
      });
    } else {
      res.status(404).json({ error: "No products updated" });
    }
  } catch (error) {
    console.error("Error updating products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Delete operation - DELETE /products
router.delete("/", async (req, res) => {
  try {
    const productModel = await Product();
    const itemsToDelete = req.body; // JSON array of items to delete
    const itemNos = itemsToDelete.map(item => item.itemNo);
    const deletedProducts = await productModel.destroy({
      where: { itemNo: itemNos },
    });
    if (deletedProducts > 0) {
      res.status(200).json({ success: true, message: "Products deleted successfully" });
    } else {
      res.status(404).json({ error: "Products not found" });
    }
  } catch (error) {
    console.error("Error deleting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
