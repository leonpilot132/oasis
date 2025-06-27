// models/CustomPizza.js
const mongoose = require('mongoose');

const CustomPizzaComponentSchema = new mongoose.Schema({
    itemId: { // Reference to MenuItem ID
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    name: String, // Store name for convenience
    price: Number // Store price at creation for consistency
});

const CustomPizzaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Can be created by anonymous user before login
    },
    name: {
        type: String,
        default: 'Custom Pizza' // AI generated or default
    },
    description: {
        type: String,
        default: 'A delicious custom pizza.' // AI generated or default
    },
    components: [CustomPizzaComponentSchema], // Embedded array of components
    totalPrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('CustomPizza', CustomPizzaSchema);
