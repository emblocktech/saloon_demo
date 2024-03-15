import express from "express";
import getUserModel from "../models/customer.js";

const router = express.Router();

// Read operation - GET /customers
router.get("/", async (req, res) => {
  try {
    const User = await getUserModel();
    const customers = await User.findAll();
    res.status(200).json({
      success: true,
      message: "Customers fetched successfully",
      data: customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create operation - POST /customers
router.post("/", async (req, res) => {
  try {
    const User = await getUserModel();
    const data = req.body;
    const userData = {
      customername: data.customername,
      phonenumber: data.phonenumber,
      points: data.points,
    };
    const customer = await User.create(userData);
    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update operation - PUT /customers/:id
router.put("/:id", async (req, res) => {
  try {
    const User = await getUserModel();
    const userId = req.params.id;
    const data = req.body;
    const updatedRows = await User.update(data, { where: { id: userId } });
    if (updatedRows[0] === 1) {
      const updatedCustomer = await User.findByPk(userId);
      res.status(200).json({
        success: true,
        message: "Customer updated successfully",
        data: updatedCustomer,
      });
    } else {
      res.status(404).json({ error: "Customer not found" });
    }
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete operation - DELETE /customers/:id
router.delete("/:id", async (req, res) => {
  try {
    const User = await getUserModel();
    const userId = req.params.id;
    const deletedRowCount = await User.destroy({ where: { id: userId } });
    if (deletedRowCount === 1) {
      res
        .status(200)
        .json({ success: true, message: "Customer deleted successfully" });
    } else {
      res.status(404).json({ error: "Customer not found" });
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
