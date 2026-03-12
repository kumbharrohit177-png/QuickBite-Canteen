const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// @route   GET /api/menu
// @desc    Get all food items
router.get('/', async (req, res) => {
    try {
        const items = await FoodItem.find({ available: true });
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/menu/all
// @desc    Get all food items (including unavailable, for admin)
router.get('/all', async (req, res) => {
    try {
        const items = await FoodItem.find();
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/menu
// @desc    Add a new food item (Admin/Kitchen only - middleware to be added)
router.post('/', upload.single('imageFile'), async (req, res) => {
    try {
        const itemData = req.body;
        if (req.file) {
            itemData.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }
        const newItem = new FoodItem(itemData);
        const item = await newItem.save();
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/menu/:id
// @desc    Update a food item
router.put('/:id', upload.single('imageFile'), async (req, res) => {
    try {
        let item = await FoodItem.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });

        const itemData = req.body;
        if (req.file) {
            itemData.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        item = await FoodItem.findByIdAndUpdate(req.params.id, { $set: itemData }, { new: true });
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/menu/:id
// @desc    Delete a food item
router.delete('/:id', async (req, res) => {
    try {
        let item = await FoodItem.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });

        await FoodItem.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Item removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
