// utils/aiService.js
const generatePizzaSuggestionAI = async (pizzaConfig) => {
    // This function would make an API call to an actual AI model (e.g., Google Gemini, OpenAI GPT)
    // based on the `pizzaConfig` (base, sauce, cheese, veggies).
    console.log('Calling AI for pizza suggestions with config:', pizzaConfig);

    // Example using Google Gemini (requires @google/generative-ai npm package and API key)
    // const { GoogleGenerativeAI } = require('@google/generative-ai');
    // const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    // const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // const prompt = `Suggest a creative and appealing name and a short description (max 20 words) for a pizza with the following ingredients:
    // Base: ${pizzaConfig.base.name}
    // Sauce: ${pizzaConfig.sauce.name}
    // Cheese: ${pizzaConfig.cheese.name}
    // Veggies: ${pizzaConfig.veggies.map(v => v.name).join(', ')}.
    // Respond in JSON format like: {"name": "...", "description": "..."}`;

    // try {
    //     const result = await model.generateContent(prompt);
    //     const response = await result.response;
    //     const text = response.text();
    //     return JSON.parse(text);
    // } catch (error) {
    //     console.error('Error calling Gemini API for pizza suggestion:', error);
    //     return { name: "Creative Pizza", description: "A delicious custom blend." };
    // }

    // Placeholder logic
    if (pizzaConfig.veggies.some(v => v.name === 'Pineapple')) {
        return { name: "Tropical Tango", description: "A bold blend of sweet pineapple and savory delights." };
    }
    return { name: "Your Dream Pizza", description: "Crafted just for you, a symphony of flavors." };
};

const generatePairingSuggestionAI = async (orderItems) => {
    // This would similarly call an AI model to suggest pairings based on the order items.
    console.log('Calling AI for pairing suggestions with items:', orderItems);

    // Placeholder logic
    return ["Garlic Bread", "Coca-Cola", "Choco Lava Cake"];
};

module.exports = { generatePizzaSuggestionAI, generatePairingSuggestionAI };
