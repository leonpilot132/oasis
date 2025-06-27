// routes/index.js
const authRoutes = require('./auth');
const menuRoutes = require('./menu');
const pizzaRoutes = require('./pizza');
const orderRoutes = require('./order');

module.exports = {
    authRoutes,
    menuRoutes,
    pizzaRoutes,
    orderRoutes
};
