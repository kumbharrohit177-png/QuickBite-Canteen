const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully');
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
    });

// Basic Route
app.get('/', (req, res) => {
    res.send('QuickBite Server is Running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
