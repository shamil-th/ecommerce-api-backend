const customerDb = require('../model/customerModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// customer signup
exports.signup = async (req, res) => {
    const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password
    }

    let email = data.email;

    const existinguser = await customerDb.findOne({ email });

    if (existinguser) {
        res.status(400).json("user already exists")
    }
    else {

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const customer = new customerDb({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            password: hashedPassword
        })

        customer
            .save(customer)
            .then(data => {
                res.send(data)
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "some error occured"
                })
            })
    }

};

// customer login
exports.login = async (req, res) => {
    try{
    const password = req.body.password;
    const email = req.body.email;

    const customer = await customerDb.findOne({ email });

    if (!customer) {
        return res.status(404).send('No user found');
    }
    let passwordIsValid = await bcrypt.compare(password, customer.password)

    if (!passwordIsValid) {
        return res.status(401).send({ auth: false, token: null });
    }
    // Generate JWT token
    let token =jwt.sign({id:customer._id},process.env.SECRET_KEY, {
        expiresIn: 86400
    });

    res.status(200).send({ auth: true, token: token });
}
   catch(err){
    console.error(err);
    res.status(500).send("internal server error");
   }
}