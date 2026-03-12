const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const Inventory = require('../models/Inventory');
const Notification = require('../models/Notification');
const Settings = require('../models/Settings');
const jwt = require('jsonwebtoken');

// Middleware to check Admin roll
const verifyAdmin = async (req, res, next) => {
    try {
        let token = req.header('x-auth-token');
        if (!token && req.header('Authorization')) {
            token = req.header('Authorization').split(' ')[1];
        }

        if (!token) return res.status(401).json({ success: false, message: 'Access Denied. No token provided.' });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const userId = verified.user ? verified.user.id : verified.id;
        const user = await User.findById(userId);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access Denied. Admin only.' });
        }

        req.user = verified.user || verified;
        next();
    } catch (err) {
        res.status(400).json({ success: false, message: 'Invalid Token' });
    }
};

// ----------------------------------------------------
// 1. DASHBOARD STATS
// ----------------------------------------------------
router.get('/stats', verifyAdmin, async (req, res) => {
    try {
        // Total Orders Today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const totalOrdersToday = await Order.countDocuments({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        // Today's Revenue
        const todayOrders = await Order.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'Cancelled' }
        });
        const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        // Pending Orders
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });

        // Total Menu Items
        const totalMenuItems = await FoodItem.countDocuments();

        // Total Users
        const totalUsers = await User.countDocuments();

        // Weekly Sales Graph Data (Last 7 days)
        const weeklySales = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);

            const dayOrders = await Order.find({
                createdAt: { $gte: date, $lt: nextDate },
                status: { $ne: 'Cancelled' }
            });

            const dayRevenue = dayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
            weeklySales.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                revenue: dayRevenue
            });
        }

        res.json({
            success: true,
            stats: {
                totalOrdersToday,
                todayRevenue,
                pendingOrders,
                totalMenuItems,
                totalUsers,
                weeklySales
            }
        });

    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ----------------------------------------------------
// 4. INVENTORY MANAGEMENT
// ----------------------------------------------------
router.get('/inventory', verifyAdmin, async (req, res) => {
    try {
        const inventory = await Inventory.find().sort({ itemName: 1 });
        res.json({ success: true, inventory });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/inventory', verifyAdmin, async (req, res) => {
    try {
        const newItem = new Inventory(req.body);
        await newItem.save();
        res.status(201).json({ success: true, item: newItem });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.put('/inventory/:id', verifyAdmin, async (req, res) => {
    try {
        const updatedItem = await Inventory.findByIdAndUpdate(
            req.params.id,
            { ...req.body, lastUpdated: Date.now() },
            { new: true }
        );
        res.json({ success: true, item: updatedItem });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.delete('/inventory/:id', verifyAdmin, async (req, res) => {
    try {
        await Inventory.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ----------------------------------------------------
// 5. USER MANAGEMENT
// ----------------------------------------------------
router.get('/users', verifyAdmin, async (req, res) => {
    try {
        // Exclude password from results
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Endpoint to "block" or "unblock" users, or update role
router.put('/users/:id', verifyAdmin, async (req, res) => {
    // For now we just update role or mock blocking
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.delete('/users/:id', verifyAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ----------------------------------------------------
// 7. NOTIFICATION MANAGEMENT
// ----------------------------------------------------
router.get('/notifications', verifyAdmin, async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/notifications', verifyAdmin, async (req, res) => {
    try {
        const newNotification = new Notification(req.body);
        await newNotification.save();
        res.status(201).json({ success: true, notification: newNotification });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.delete('/notifications/:id', verifyAdmin, async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ----------------------------------------------------
// 9. SETTINGS MANAGEMENT
// ----------------------------------------------------
router.get('/settings', async (req, res) => {
    // Public endpoint so front-end can see timing
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await new Settings().save();
        }
        res.json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.put('/settings', verifyAdmin, async (req, res) => {
    try {
        const { _id, __v, ...updateData } = req.body;
        updateData.updatedAt = Date.now();

        let settings = await Settings.findOneAndUpdate(
            {},
            updateData,
            { new: true, upsert: true }
        );
        res.json({ success: true, settings });
    } catch (error) {
        console.error("Settings Save Error:", error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});


module.exports = router;
