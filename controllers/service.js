import express from "express";
import Service from "../models/service.js";

const router = express.Router();
router.get("/", async (req, res) => {
    var ServiceModel = await Service();
    const service = await ServiceModel.findAll();
    console.log(service);
    res.send();

});

router.post("/", async (req, res) => {
    var data = req.body;
    var ServiceData = {
        servicename: data.servicename,
        serviceno: data.serviceno,
        price: data.price,
    };
    var ServiceModel = await Service();
    const service = await ServiceModel.create(ServiceData);
    console.log(service);
    res.send();
});

export default router;
