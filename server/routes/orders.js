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

// @route   GET /api/orders/test-emit
router.get('/test-emit', (req, res) => {
    const io = req.app.get('socketio');
    if (io) {
        io.emit('newOrderReceived', {
            _id: 'test' + Date.now(),
            tokenNumber: '9999',
            user: { name: 'Test User' },
            items: [],
            totalAmount: 0,
            status: 'Pending',
            createdAt: new Date().toISOString()
        });
        return res.json({ msg: 'Emitted test order' });
    }
    res.status(500).json({ msg: 'Socket IO not found' });
});

const Settings = require('../models/Settings');

// @route   POST /api/orders
// @desc    Place a new order
router.post('/', auth, async (req, res) => {
    try {
        // Enforce Canteen Open Policy
        const settings = await Settings.findOne();
        if (settings && !settings.isOpen) {
            return res.status(400).json({ msg: 'The canteen is currently closed. We are not accepting new orders.' });
        }

        const { items, totalAmount, pickupSlot, instructions } = req.body; // Remove user from body, use req.user.id

        // Generate a simple token number (e.g., last 4 digits of timestamp + random)
        const tokenNumber = Math.floor(1000 + Math.random() * 9000).toString();

        const newOrder = new Order({
            user: req.user.id,
            items,
            totalAmount,
            tokenNumber,
            pickupSlot,
            instructions
        });

        const order = await newOrder.save();

        // Emit new order event to admins/kitchen
        const io = req.app.get('socketio');
        if (io) {
            // Need to populate user details for admin panel before emitting
            const populatedOrder = await Order.findById(order._id)
                .populate('user', 'name email phone')
                .populate('items.foodItem', 'name price image');
            io.emit('newOrderReceived', populatedOrder);
        }

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
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        let order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        order.status = status;
        await order.save();

        // Emit Socket.IO event for real-time tracking
        const io = req.app.get('socketio');
        if (io) {
            io.emit('orderStatusUpdated', order);
        }

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/orders/all
// @desc    Get all orders for Admin
router.get('/all', async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate('user', 'name email phone')
            .populate('items.foodItem', 'name price image');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel a pending order
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        let order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        // Check user
        if (order.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Check status
        if (order.status !== 'Pending') {
            return res.status(400).json({ msg: 'Cannot cancel order that is being prepared' });
        }

        order.status = 'Cancelled';
        await order.save();
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
