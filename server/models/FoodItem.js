const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String, // Snacks, Meals, Beverages, etc.
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    isVeg: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
