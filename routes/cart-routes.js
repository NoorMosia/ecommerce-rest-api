const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/is-auth');
const CartControllers = require("../controllers/cart-controllers");

router.get('/cart', isAuth, CartControllers.getCart);
router.post('/cart/clear', isAuth, CartControllers.clearCart);
router.post('/cart/:productId/add', isAuth, CartControllers.addToCart);
router.post('/cart/:productId/remove', isAuth, CartControllers.removeItem);
router.post('/cart/:productId/decrease', isAuth, CartControllers.decrementItem);
router.post('/cart/:productId/increase', isAuth, CartControllers.incrementItem);

module.exports = router;