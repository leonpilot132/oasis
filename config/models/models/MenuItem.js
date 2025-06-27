// models/MenuItem.js
const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String, // e.g., 'base', 'sauce', 'topping_veg', 'veg_pizza', 'drink', 'dessert'
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String
    }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
