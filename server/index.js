const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Allow frontend origin from env, or all origins in dev
const corsOrigin = process.env.CORS_ORIGIN || '*';

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: corsOrigin,
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Pass io to routes by storing it in app locals
app.set('socketio', io);

// Middleware
app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));

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

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
