const express = require('express');
const stripeRoute = express.Router();
const stripeController = require('../controller/stripeController')


stripeRoute.post('/create-checkout-session',stripeController.create);


module.exports = stripeRoute

