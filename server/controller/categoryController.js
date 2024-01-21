const categoryDb = require('../model/categorySchema');
const multer = require('multer');
const path = require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "category");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

const upload = multer({ storage: storage }).single("categoryImg");

exports.create = async (req, res) => {
  
    upload(req, {}, async (error) => {
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ error: "image error" + error });
        } else if (error) {
            return res.status(500).json({ error: "server error" + error })
        }

        const requireFields = [
            "categoryName",
        ];
        for (const field of requireFields) {
            if (!req.body[field]) {
                return res
                    .status(400)
                    .send({ message: `Error: Missing ${field} field` });
            }
        }

        const categoryImg = req.file.path;

        const category = new categoryDb({
            categoryImg: categoryImg,
            categoryName: req.body.categoryName,
        });

        category
            .save(category)
            .then(data => {
                res.send(data)
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "some error occured during creating category"
                })
            })

    });

};

exports.find = async (req, res) => {
    categoryDb.find()
        .then(categories => {
            res.send(categories)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "error occured while retriving data"
            });
        });
};

exports.update = async (req, res) => {
    const id = req.params.id;
    let categoryImg; 

    upload(req, {}, async (error) => {
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ error: "image error" + error });
        } else if (error) {
            return res.status(500).json({ error: "server error" + error })
        }

        try {
            if (req.file) {
                categoryImg = path.join('category', req.file.filename);
            }

            const category = await categoryDb.findById(id);
            console.log(category);
            if (!category) {
                return res.status(400).send({ message: `Error while updating category` });
            }

            const updatedData = {
                ...req.body,
                categoryImg: categoryImg,
            }

            const updated = await categoryDb.findByIdAndUpdate(id, updatedData, { new: true });
            res.status(200).json(updated);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    });
}
// exports.update = async (req, res) => {
//     const id = req.params.id;

//     // Multer middleware for handling file uploads
//     upload(req, {}, async (error) => {
//         if (error instanceof multer.MulterError) {
//             return res.status(400).json({ error: "image error " + error });
//         } else if (error) {
//             return res.status(500).json({ error: "server error" + error })
//         }

//         try {
//             let categoryImg;

//             if (req.file) {
//                 console.log("image found", req.file.filename)
//                 // Constructing the path for the uploaded image
//                 categoryImg = path.join('categoryImg', req.file.filename);
//             }

//             // Fetch the category by ID
//             const category = await categoryDb.findById(id);
//             console.log(category)
//             if (!category) {
//                 return res.status(400).json({ error: `Category with ID ${id} not found. Unable to update.` });
//             }
            

//             // Prepare updated data, including the new image path
//             const updatedData = {
//                 ...req.body,
//                 categoryImg: categoryImg,
//             }

//             // Update the category in the database
//             const updated = await categoryDb.findByIdAndUpdate(id, updatedData, { new: true });

//             // Send the updated category as a response
//             res.status(200).json(updated);
//         } catch (err) {
//             console.error(err);
//             res.status(500).json({ error: "Server error" });
//         }
//     });
// }


exports.remove = async (req, res) => {
    const id = req.params.id;
    categoryDb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `cannot delete category with id` + id })
            }
            else {
                res.send({
                    message: "category deleted successfully"
                })
            }
        }).catch(err => {
            res.status(500).send({
                message: "could not delete category item" + err
            });
        });
};