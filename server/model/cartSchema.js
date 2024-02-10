const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                id:{
                    type: mongoose.Schema.Types.ObjectId,
                    required:true
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
})

const cartDb = new mongoose.model('cart',cartSchema);
module.exports = cartDb