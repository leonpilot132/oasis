// routes/order.js
const express = require('express');
const router = express.Router();
const { Order, User, MenuItem, CustomPizza } = require('../models');
const { generatePairingSuggestionAI } = require('../utils/aiService');

// @route   POST /api/order
// @desc    Place a new order
// @access  Authenticated (conceptually)
router.post('/', async (req, res) => {
    const { userId, items, paymentMethod } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !paymentMethod) {
        return res.status(400).json({ message: 'Missing required order data or invalid items format.' });
    }

    try {
        const user = await User.findById(userId); // In real app: req.user.id
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const itemData of items) {
            const { type, id, quantity = 1 } = itemData;
            let itemDetails;
            let priceAtOrder;
            let itemName;

            if (type === 'menu_item') {
                itemDetails = await MenuItem.findById(id);
                if (!itemDetails) {
                    return res.status(400).json({ message: `Menu item with ID ${id} not found.` });
                }
                priceAtOrder = itemDetails.price;
                itemName = itemDetails.name;
                orderItems.push({ menuItemId: itemDetails._id, quantity, priceAtOrder, name: itemName });
            } else if (type === 'custom_pizza') {
                itemDetails = await CustomPizza.findById(id);
                if (!itemDetails) {
                    return res.status(400).json({ message: `Custom pizza with ID ${id} not found.` });
                }
                priceAtOrder = itemDetails.totalPrice;
                itemName = itemDetails.name;
                orderItems.push({ customPizzaId: itemDetails._id, quantity, priceAtOrder, name: itemName });
            } else {
                return res.status(400).json({ message: `Invalid item type: ${type}` });
            }

            totalAmount += priceAtOrder * quantity;
        }

        const newOrder = new Order({
            userId,
            items: orderItems,
            totalAmount,
            paymentMethod,
            status: 'Pending'
        });

        await newOrder.save();

        res.status(201).json({
            message: 'Order placed successfully!',
            orderId: newOrder._id,
            totalAmount: newOrder.totalAmount,
            status: newOrder.status
        });

    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Server error placing order' });
    }
});

// @route   GET /api/order/:orderId
// @desc    Get details of a specific order
// @access  Authenticated (conceptually)
router.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        // .populate('userId', 'phoneNumber') // Optionally populate user details
        // .populate('items.menuItemId') // Optionally populate menu item details
        // .populate('items.customPizzaId'); // Optionally populate custom pizza details

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Server error fetching order' });
    }
});

// @route   PUT /api/order/:orderId/status
// @desc    Update order status
// @access  Admin/Delivery Agent (conceptually)
router.put('/:orderId/status', async (req, res) => {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({ message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
    }

    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.json({ message: `Order ${order._id} status updated to ${status}`, order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error updating order status' });
    }
});

// @route   POST /api/checkout/suggest_pairings
// @desc    Suggest pairings for items in the current cart/order summary.
// @access  Public
router.post('/suggest_pairings', async (req, res) => {
    const { itemIds = [] } = req.body; // Array of MenuItem or CustomPizza IDs

    // In a real app, you'd fetch the actual items from DB using these IDs
    // For this conceptual example, we'll just pass the IDs to the AI function
    try {
        const suggestedPairings = await generatePairingSuggestionAI(itemIds);
        res.json({ suggestions: suggestedPairings });
    } catch (error) {
        console.error('Error suggesting pairings:', error);
        res.status(500).json({ message: 'Server error during pairing suggestion' });
    }
});

module.exports = router;
