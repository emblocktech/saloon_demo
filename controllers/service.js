import express from "express";
import Service from "../models/service.js";

const router = express.Router();

// Read operation - GET /services
router.get("/", async (req, res) => {
  try {
    const serviceModel = await Service();
    const services = await serviceModel.findAll();
    res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      data: services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create operation - POST /services
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const serviceData = {
      servicename: data.servicename,
      serviceno: data.serviceno,
      price: data.price,
    };
    const serviceModel = await Service();
    const service = await serviceModel.create(serviceData);
    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update operation - PUT /services/:id
router.put("/:id", async (req, res) => {
  try {
    const serviceModel = await Service();
    const serviceId = req.params.id;
    const data = req.body;
    const updatedRows = await serviceModel.update(data, {
      where: { id: serviceId },
    });
    if (updatedRows[0] === 1) {
      const updatedService = await serviceModel.findByPk(serviceId);
      res.status(200).json({
        success: true,
        message: "Service updated successfully",
        data: updatedService,
      });
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete operation - DELETE /services/:id
router.delete("/:id", async (req, res) => {
  try {
    const serviceModel = await Service();
    const serviceId = req.params.id;
    const deletedRowCount = await serviceModel.destroy({
      where: { id: serviceId },
    });
    if (deletedRowCount === 1) {
      res
        .status(200)
        .json({ success: true, message: "Service deleted successfully" });
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
