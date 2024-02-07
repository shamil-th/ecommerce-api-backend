const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: {
        type: [],
    },
    userId: {
        type: String,
        require: true
    },
})

const cartDb = new mongoose.model('cart',cartSchema);
module.exports = cartDb