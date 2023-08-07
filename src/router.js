const mongoose = require("mongoose");
const express = require("express");
const { user } = require("../src/model/model");
const bcrypt = require("bcrypt");
const { secretKey } = require("../config");
const router = express.Router();
const jwt = require("jsonwebtoken")
const { authenticate }  = require("./authmiddleware")


router.post("/register", async (req, res) => {
    try {
        const data = {
            userName: req.body.userName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            class: req.body.class,
            collegeName: req.body.collegeName,
            rollNu: req.body.rollNu,
            rollCode: req.body.rollCode
        };
        const existingUser = await user.findOne({ email: data.email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const saltrounds = 5;
        const hashedpassword = await bcrypt.hash(req.body.password, saltrounds);
        data.password = hashedpassword;

        const userData = new user(data);
        let data1 = await userData.save();

        return res.status(200).json({
            msg: "Successfully registered",
            result: data1
        });
    } catch (error) {
        console.log("Error during registration:", error.message);
        res.status(500).json({
            msg: "Error occurred during registration",
            error: error.message
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, secretKey, { expiresIn: "24h" });
        res.status(200).json({
            message: "Login successful",
            user: existingUser,
            token
        });
    } catch (error) {
        console.log("Error during login:", error.message);
        res.status(500).json({
            message: "Error occurred during login",
            error: error.message
        });
    }
});
router.get("/getdata/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = await user.findById(userId);
        if (!userData) {
            return res.status(404).json({ message: "User data not found" });
        }
        res.status(200).json({
            message: "User data found",
            user: userData
        });
    } catch (error) {
        console.log("Error while getting data:", error.message);
        res.status(500).json({
            message: "Error occurred while getting data",
            error: error.message
        });
    }
});

router.get("/getdataByUserToken", authenticate, async (req, res) => {
    // console.log("re=============", req.user)
    // console.log("het ------------")
    try {
        const userId = req.user.id; 
        console.log("userId--------------",userId)
        const userData = await user.findById(userId);
        if (!userData) {
            return res.status(404).json({ message: "User data not found" });
        }
        res.status(200).json({
            message: "User data found successfully...",
            user: userData,
        });
    } catch (error) {
        console.log("Error while getting data:", error.message);
        res.status(500).json({
            message: "Error occurred while getting data",
            error: error.message,
        });
    }
});
router.put("/updatedataByUserToken", authenticate, async (req, res) => {
    // console.log("re=============", req.user)
    // console.log("het ------------")
    try {
        const userId = req.user.id; 
        console.log("userId--------------",userId)
        let obj = {
            userName: req.body.userName,
            lastName: req.body.lastName,
}
        const userData = await user.findByIdAndUpdate(userId, { $set: obj }, { new: true });
        if (!userData) {
            return res.status(404).json({ message: "User data not found" });
        }
        res.status(200).json({
            message: "User data found successfully...",
            user: userData,
        });
    } catch (error) {
        console.log("Error while getting data:", error.message);
        res.status(500).json({
            message: "Error occurred while getting data",
            error: error.message,
        });
    }
});
router.delete("/deletedataByUserToken", authenticate, async (req, res) => {
    try {
        const userId = req.user.id; 
        console.log("userId--------------",userId)
        const userData = await user.findByIdAndDelete(userId);
        if (!userData) {
            return res.status(404).json({ message: "User data not found" });
        }
        res.status(200).json({
            message: "User data found successfully...",
            user: userData,
        });
    } catch (error) {
        console.log("Error while getting data:", error.message);
        res.status(500).json({
            message: "Error occurred while getting data",
            error: error.message,
        });
    }
});

module.exports = router;
