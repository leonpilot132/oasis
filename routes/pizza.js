// routes/pizza.js
const express = require('express');
const router = express.Router();
const { MenuItem, CustomPizza } = require('../models');
const { generatePizzaSuggestionAI } = require('../utils/aiService');

// @route   POST /api/custom_pizza/suggest
// @desc    Suggest custom pizza name/description using AI
// @access  Public
router.post('/suggest', async (req, res) => {
    const { baseId, sauceId, cheeseId, veggieIds = [] } = req.body;

    try {
        const base = await MenuItem.findById(baseId);
        const sauce = await MenuItem.findById(sauceId);
        const cheese = await MenuItem.findById(cheeseId);
        const veggies = await MenuItem.find({ _id: { $in: veggieIds } });

        if (!base || !sauce || !cheese) {
            return res.status(400).json({ message: 'Invalid base, sauce, or cheese selected.' });
        }

        const pizzaConfigForAI = {
            base: { name: base.name, price: base.price },
            sauce: { name: sauce.name, price: sauce.price },
            cheese: { name: cheese.name, price: cheese.price },
            veggies: veggies.map(v => ({ name: v.name, price: v.price }))
        };

        const aiSuggestions = await generatePizzaSuggestionAI(pizzaConfigForAI);
        res.json(aiSuggestions);

    } catch (error) {
        console.error('Error suggesting pizza details:', error);
        res.status(500).json({ message: 'Server error during AI suggestion' });
    }
});

// @route   POST /api/custom_pizza
// @desc    Create and save a custom pizza
// @access  Authenticated (conceptually)
router.post('/', async (req, res) => {
    const { userId, baseId, sauceId, cheeseId, veggieIds = [], suggestedName, suggestedDescription } = req.body;

    try {
        // In a real app, userId would be extracted from a JWT token
        // const user = await User.findById(req.user.id); // If using real auth

        const base = await MenuItem.findById(baseId);
        const sauce = await MenuItem.findById(sauceId);
        const cheese = await MenuItem.findById(cheeseId);
        const veggies = await MenuItem.find({ _id: { $in: veggieIds } });

        if (!base || !sauce || !cheese) {
            return res.status(400).json({ message: 'Invalid base, sauce, or cheese selected.' });
        }

        let totalPrice = base.price + sauce.price + cheese.price;
        const components = [
            { itemId: base._id, name: base.name, price: base.price },
            { itemId: sauce._id, name: sauce.name, price: sauce.price },
            { itemId: cheese._id, name: cheese.name, price: cheese.price }
        ];

        veggies.forEach(veg => {
            totalPrice += veg.price;
            components.push({ itemId: veg._id, name: veg.name, price: veg.price });
        });

        const newCustomPizza = new CustomPizza({
            userId: userId, // In real app: req.user.id
            name: suggestedName || "Custom Pizza",
            description: suggestedDescription || "A delicious custom pizza.",
            components: components,
            totalPrice: totalPrice
        });

        await newCustomPizza.save();

        res.status(201).json({
            message: 'Custom pizza created successfully',
            customPizzaId: newCustomPizza._id,
            totalPrice: newCustomPizza.totalPrice,
            name: newCustomPizza.name
        });

    } catch (error) {
        console.error('Error creating custom pizza:', error);
        res.status(500).json({ message: 'Server error creating custom pizza' });
    }
});

module.exports = router;
