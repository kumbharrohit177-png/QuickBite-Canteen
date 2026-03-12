require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/Settings');

async function debugSettings() {
    await mongoose.connect(process.env.MONGO_URI);

    let settings = await Settings.findOne();
    if (!settings) {
        settings = new Settings({
            canteenName: 'QuickBite',
            openingTime: '09:00 AM',
            closingTime: '05:00 PM',
            taxPercentage: 5,
            contactEmail: 'x@y.com',
            contactPhone: '123',
            deliveryRules: 'Pickup',
            isOpen: true
        });
        await settings.save();
        console.log("Created settings");
    }

    try {
        const updateData = { openingTime: '10:00 AM' };
        Object.assign(settings, updateData);
        settings.updatedAt = Date.now();
        await settings.save();
        console.log("Updated settings successfully");
    } catch (err) {
        console.error("Failed to update:", err);
    }
    process.exit(0);
}

debugSettings();
