import express from "express"
import User from "../models/customer.js";

const router = express.Router()

router.get("/", async (req, res) => {
    const user = await User().findAll()
    console.log(user)
})

router.post("/", async (req, res) => {
    const user = await User().create({ username: "John" })
    console.log(user)
})

export default router;