const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
require('dotenv').config();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   POST /api/payment/create-order
// @desc    Create a Razorpay order
router.post('/create-order', auth, async (req, res) => {
    try {
        const { amount } = req.body; // Amount in INR

        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.json(order);
    } catch (err) {
        console.error("Razorpay Error:", err);
        res.status(500).send('Payment initiation failed');
    }
});

// @route   POST /api/payment/verify
// @desc    Verify payment and create order in DB
router.post('/verify', auth, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData // The actual order details (items, totalAmount, etc.)
        } = req.body;

        // Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ msg: 'Invalid Payment Signature' });
        }

        // Payment is legit, now create the order in DB
        const { items, totalAmount, pickupSlot } = orderData;
        const tokenNumber = Math.floor(1000 + Math.random() * 9000).toString();

        const newOrder = new Order({
            user: req.user.id,
            items,
            totalAmount,
            tokenNumber,
            pickupSlot,
            paymentStatus: 'Paid',
            status: 'Pending'
        });

        const savedOrder = await newOrder.save();
        res.json({ success: true, order: savedOrder });

    } catch (err) {
        console.error("Payment Verification Error:", err);
        res.status(500).send('Payment verification failed');
    }
});

module.exports = router;
