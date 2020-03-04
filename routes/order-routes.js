const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/is-auth');
const orderControllers = require('../controllers/order-controllers')

router.get('/orders', isAuth, orderControllers.getAllOrders);
router.post('/order/add', isAuth, orderControllers.addOrder);
router.get('/orders/mine', isAuth, orderControllers.getAllOrders);


module.exports = router;