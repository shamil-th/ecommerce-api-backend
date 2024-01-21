const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    firstName : {
        type : String,
        require: true
    },
    lastName : {
        type : String,
        require : true
    },
    phone : {
        type : Number,
        require : true
    },
    email : {
        type : String,
        require : true
    },
    password : {
        type : String,
        require : true
    }
})

const adminDb = mongoose.model('admin',adminSchema);
module.exports = adminDb
