const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// @route   GET /api/orders/my-orders
// @desc    Get logged in user's orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('items.foodItem', 'name price image');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/orders
// @desc    Place a new order
// @route   POST /api/orders
// @desc    Place a new order
router.post('/', auth, async (req, res) => {
    try {
        const { items, totalAmount, pickupSlot } = req.body; // Remove user from body, use req.user.id

        // Generate a simple token number (e.g., last 4 digits of timestamp + random)
        const tokenNumber = Math.floor(1000 + Math.random() * 9000).toString();

        const newOrder = new Order({
            user: req.user.id,
            items,
            totalAmount,
            tokenNumber,
            pickupSlot
        });

        const order = await newOrder.save();
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/orders/user/:userId
// @desc    Get orders for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/orders/kitchen
// @desc    Get all active orders for kitchen (Pending, Preparing, Ready)
router.get('/kitchen', async (req, res) => {
    try {
        const orders = await Order.find({
            status: { $in: ['Pending', 'Preparing', 'Ready'] }
        }).sort({ createdAt: 1 }); // Oldest first for kitchen
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        let order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        order.status = status;
        await order.save();
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
