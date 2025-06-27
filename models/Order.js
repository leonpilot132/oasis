// models/Order.js
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    menuItemId: { // For predefined menu items
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: false
    },
    customPizzaId: { // For custom pizzas
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CustomPizza',
        required: false
    },
    name: String, // Name of the item/pizza for easier display
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    priceAtOrder: { // Price at the time of ordering to prevent discrepancies
        type: Number,
        required: true
    }
});

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        required: true
    },
    items: [OrderItemSchema] // Embedded array of order items
});

module.exports = mongoose.model('Order', OrderSchema);
