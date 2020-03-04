const express = require('express');
const router = express.Router();

const productControllers = require('../controllers/product-controllers');
const isAuth = require('../middleware/is-auth')

router.get("/", productControllers.getAllProducts);
router.get("/products", productControllers.getAllProducts);
router.post("/products", isAuth, productControllers.createProduct);
router.patch('/products/:productId', isAuth, productControllers.updateProduct);
router.delete('/products/:productId', isAuth, productControllers.deleteProduct);
router.get("/products/:productId", productControllers.getProductDetails);

module.exports = router;