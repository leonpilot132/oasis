// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { authRoutes, menuRoutes, pizzaRoutes, orderRoutes } = require('./routes');
const { MenuItem } = require('./models'); // Import MenuItem model for seeding

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Body parser for JSON requests

// Seed Data Function (run once or upon initial connection)
async function seedData() {
    // Check if menu items already exist to prevent duplicates on every app restart
    const existingMenuItems = await MenuItem.countDocuments();
    if (existingMenuItems === 0) {
        console.log("Seeding initial menu data...");
        const bases = [
            { name: "Thin Crust", category: "base", price: 100.0, description: "Crispy and light." },
            { name: "Hand Tossed", category: "base", price: 120.0, description: "Classic, chewy crust." },
            { name: "Deep Dish", category: "base", price: 150.0, description: "Thick, hearty, Chicago style." },
            { name: "Gluten-Free", category: "base", price: 180.0, description: "Delicious gluten-free option." },
            { name: "Cauliflower", category: "base", price: 200.0, description: "Healthy and low-carb." }
        ];
        const sauces = [
            { name: "Marinara", category: "sauce", price: 30.0 },
            { name: "Pesto", category: "sauce", price: 40.0 },
            { name: "BBQ", category: "sauce", price: 35.0 },
            { name: "White Garlic", category: "sauce", price: 45.0 },
            { name: "Spicy Ranch", category: "sauce", price: 50.0 }
        ];
        const cheeses = [
            { name: "Mozzarella", category: "cheese", price: 60.0 },
            { name: "Cheddar", category: "cheese", price: 70.0 },
            { name: "Provolone", category: "cheese", price: 65.0 },
            { name: "Feta", category: "cheese", price: 80.0 },
            { name: "Vegan Cheese", category: "cheese", price: 90.0 }
        ];
        const veggies = [
            { name: "Onion", category: "topping_veg", price: 20.0 },
            { name: "Bell Pepper", category: "topping_veg", price: 25.0 },
            { name: "Mushroom", category: "topping_veg", price: 30.0 },
            { name: "Olives", category: "topping_veg", price: 35.0 },
            { name: "Spinach", category: "topping_veg", price: 28.0 },
            { name: "Jalapenos", category: "topping_veg", price: 32.0 },
            { name: "Pineapple", category: "topping_veg", price: 40.0 }
        ];
        const vegPizzas = [
            { name: "Classic Margherita", category: "veg_pizza", price: 350.0, description: "Tomato, mozzarella, basil." },
            { name: "Paneer Tikka", category: "veg_pizza", price: 420.0, description: "Paneer, onions, capsicum, tikka sauce." },
            { name: "Farmhouse", category: "veg_pizza", price: 390.0, description: "Onion, capsicum, mushroom, corn." }
        ];
        const nonVegPizzas = [
            { name: "Chicken Dominator", category: "non_veg_pizza", price: 480.0, description: "Pepper barbecue chicken, onion." },
            { name: "Pepperoni", category: "non_veg_pizza", price: 500.0, description: "Classic pepperoni and cheese." },
        ];
        const dessertsDrinks = [
            { name: "Garlic Bread", category: "side", price: 99.0 },
            { name: "Coca-Cola", category: "drink", price: 60.0 },
            { name: "Pepsi", category: "drink", price: 60.0 },
            { name: "Choco Lava Cake", category: "dessert", price: 120.0 },
        ];

        await MenuItem.insertMany([
            ...bases, ...sauces, ...cheeses, ...veggies,
            ...vegPizzas, ...nonVegPizzas, ...dessertsDrinks
        ]);
        console.log("Menu data seeded successfully.");
    } else {
        console.log("Menu data already exists. Skipping seeding.");
    }
}

// Call seed data function after database connection is established
// For simplicity, calling it here. In production, you might run this as a separate script.
mongoose.connection.once('open', async () => {
    await seedData();
});

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/custom_pizza', pizzaRoutes); // Using '/api/custom_pizza' as base for pizza routes
app.use('/api/order', orderRoutes); // Using '/api/order' as base for order routes


// Basic route for testing
app.get('/', (req, res) => {
    res.send('LeoPizza Backend API is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
