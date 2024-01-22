const adminDb = require("../model/adminModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        const admin = await adminDb.findOne({ email });

        // Handle case where no admin is found
        if (!admin) {
            return res.status(404).send('No user found');
        }

        // Compare the hashed password
        let passwordIsValid = await bcrypt.compare(password, admin.password);

        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, token: null });
        }

        // Generate JWT token
        let token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY, {
            expiresIn: 86400
        });

        res.status(200).send({ auth: true, token: token });
        
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
}
