const express = require('express');
const categoryRoute = express.Router();
const categoryController = require('../controller/categoryController');

categoryRoute.post('/create-category',categoryController.create);
categoryRoute.get('/get-category', categoryController.find);
categoryRoute.put('/get-category/:id', categoryController.update);
categoryRoute.delete('/remove-category/:id', categoryController.remove)

module.exports = categoryRoute
