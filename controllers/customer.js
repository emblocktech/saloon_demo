import express from "express";
import User from "../models/customer.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const user = await User().findAll();
    console.log(user);
    res.send();
});

router.post("/", async (req, res) => {
    var data = req.body;
    var userData = {
        customername: data.customername,
        phonenumber: data.phonenumber,
        points: data.points,
    };
    const user = await User().create(userData);
    console.log(user);
    res.body= "Done"
    res.send();
});

export default router;
