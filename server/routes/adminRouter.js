const express = require('express');
const adminRoute = express.Router();
const adminController = require('../controller/adminController')


adminRoute.post('/login',adminController.login);

module.exports = adminRoute