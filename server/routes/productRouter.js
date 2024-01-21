const express = require('express');
const productRoute = express.Router();
const productController = require('../controller/productController');

productRoute.post('/product',productController.create);
productRoute.put('/product/:id',productController.update);
productRoute.delete('/product/:id',productController.remove);
productRoute.get('/category/products/:id',productController.findByCategory);

module.exports = productRoute