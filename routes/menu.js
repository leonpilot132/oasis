// routes/menu.js
const express = require('express');
const router = express.Router();
const { MenuItem } = require('../models');

// @route   GET /api/menu
// @desc    Get all menu items, categorized
// @access  Public
router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({});
        
        const categorizedMenu = {
            bases: [],
            sauces: [],
            cheeses: [],
            topping_veg: [],
            veg_pizzas: [],
            non_veg_pizzas: [],
            desserts: [],
            drinks: [],
            sides: []
        };

        menuItems.forEach(item => {
            const itemData = {
                id: item._id,
                name: item.name,
                price: item.price,
                description: item.description,
                imageUrl: item.imageUrl
            };
            if (categorizedMenu[item.category]) {
                categorizedMenu[item.category].push(itemData);
            } else {
                // If a new category appears, add it dynamically
                categorizedMenu[item.category] = [itemData];
            }
        });

        res.json(categorizedMenu);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ message: 'Server error fetching menu' });
    }
});

module.exports = router;
