const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/notifications
// @desc    Get all notifications for users
// @access  Public (or protected if needed)
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json({ success: true, notifications });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/notifications/dismissed
// @desc    Get user's dismissed notifications
// @access  Private
router.get('/dismissed', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('dismissedNotifications');
        res.json({ success: true, dismissed: user.dismissedNotifications || [] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/notifications/dismiss
// @desc    Save dismissed notifications
// @access  Private
router.post('/dismiss', auth, async (req, res) => {
    try {
        const { dismissedIds } = req.body;
        
        await User.findByIdAndUpdate(req.user.id, {
            $set: { dismissedNotifications: dismissedIds }
        });

        res.json({ success: true, msg: 'Dismissed notifications updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
