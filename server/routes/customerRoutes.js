const express = require('express');
const customerRoute = express.Router();
const customerController = require('../controller/customerController')


customerRoute.post('/signup',customerController.signup);
customerRoute.post('/login',customerController.login);

module.exports = customerRoute