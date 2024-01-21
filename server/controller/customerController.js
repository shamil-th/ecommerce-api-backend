

// exports.signup = async (req, res) => {
//     const data = {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         phone: req.body.phone,
//         password: req.body.password
//     }

//     let email = data.email;

//     const existinguser = await adminDb.findOne({ email });

//     if (existinguser) {
//         res.status(400).json("user already exists")
//     }
//     else {
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(data.password, saltRounds);

//         const admin = new adminDb({
//             firstName: data.firstName,
//             lastName: data.lastName,
//             email: data.email,
//             phone: data.phone,
//             password: hashedPassword
//         })

//         admin
//             .save(admin)
//             .then(data => {
//                 res.send(data)
//             })
//             .catch(err => {
//                 res.status(500).send({
//                     message: err.message || "some error occured"
//                 })
//             })
//     }

// }