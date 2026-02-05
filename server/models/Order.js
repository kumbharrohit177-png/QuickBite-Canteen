const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            foodItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'FoodItem'
            },
            name: String, // Store snapshot of name
            price: Number, // Store snapshot of price
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Ready', 'Collected', 'Cancelled'],
        default: 'Pending'
    },
    tokenNumber: {
        type: String,
        required: true
    },
    pickupSlot: {
        type: String // e.g., "12:30 PM - 12:45 PM"
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending' // For now, we assume simple flow
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
