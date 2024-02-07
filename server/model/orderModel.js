const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

});

const orderDb = new mongoose.model('order',orderSchema);
module.exports = orderDb