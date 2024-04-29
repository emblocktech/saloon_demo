import express from "express";
import getAdmin from "../models/authorizationmanagement.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const router = express.Router();

// Read operation - GET /authorizationmanagement
router.get("/", async (req, res) => {
  try {
    const admin = await getAdmin();
    const admins = await admin.findAll();
    res.status(200).json({
      success: true,
      message: "Admins fetched successfully",
      data: admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Read operation - POST /authorizationmanagement
router.post("/", async (req, res) => {
    try {
        const admin = await getAdmin();
        const data = req.body;
        const hash_password = await bcrypt.hash(data.password, 10)
        const userData = {
            username: data.username,
            password: hash_password,
            profile: data.profile,
            email: data.email,
            location: data.location,
        };
        const resAdmin = await admin.create(userData);
        res.status(201).json({
          success: true,
          message: "Admins created successfully",
          data: resAdmin,
        });
    } catch (error) {
      console.error("Error creating admins:", error);
      res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/login", async (req, res) => {
    const b = req.body
    try {
        const admin = await getAdmin();
        const admins = await admin.findOne({ where: { username: b.username } });
        if (!admins) {
            return res.status(201).send({success: false, message: "No admins exists"})
        }
        const same = await bcrypt.compare(b.password, admins.password);
        if (same) {
            const date = new Date()
            const payload = { username: admins.username }
            const secret = date.getMilliseconds().toString()
            const token = jwt.sign(payload, secret)
            res.status(201).send({success: true, message: {
                token: `${token}`,
                profile: admins.profile,
                location: admins.location
            }})
        } else {
            res.status(201).send({success: false, message: "Incorrect username and password"})
        }
    } catch (error) {
      console.error("Error creating admins:", error);
      res.status(500).json({ error: "Internal server error" });
    }
})


export default router;
