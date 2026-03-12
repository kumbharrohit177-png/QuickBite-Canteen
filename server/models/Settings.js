const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    canteenName: {
        type: String,
        default: 'QuickBite Canteen'
    },
    openingTime: {
        type: String,
        default: '08:00 AM'
    },
    closingTime: {
        type: String,
        default: '06:00 PM'
    },
    taxPercentage: {
        type: Number,
        default: 5
    },
    contactEmail: {
        type: String,
        default: 'admin@quickbite.com'
    },
    contactPhone: {
        type: String,
        default: '+91 9876543210'
    },
    deliveryRules: {
        type: String,
        default: 'Pickup only at the counter.'
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Settings', settingsSchema);
