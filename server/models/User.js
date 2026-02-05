const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () { return !this.googleId; } // Password is required only if googleId is not present
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple documents to have no googleId
    },
    role: {
        type: String,
        enum: ['student', 'admin', 'kitchen'],
        default: 'student'
    },
    phone: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
