const express = require('express');
const cartRoute = express.Router();
const cartController = require('../controller/cartController')


cartRoute.post('/',cartController.create);
cartRoute.get('/:id',cartController.find);
cartRoute.put('/',cartController.removeProduct);

module.exports = cartRoute