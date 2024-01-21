const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const adminDb = require('./server/model/adminModel');

mongoose.connect('mongodb+srv://admin:1234@cluster0.5q2qe8i.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => {
        console.log('MONGO CONNECTION OPEN!!!');
    })
    .catch((err) => {
        console.log(err);
    });


const seedDb = async () => {
  
    const adminpassword = "12345";
    const hashedPassword = await bcrypt.hash(adminpassword, 10);

    const admin = [
        {
            firstName: "Mohammed",
            lastName: "Shamil T H",
            email: "shamilth2@gmail.com",
            phone: 9495127120,
            password: hashedPassword       
         }
    ];


    await adminDb.deleteMany({});
    await adminDb.insertMany(admin);
};

seedDb().then(() => {
    mongoose.connection.close();
});