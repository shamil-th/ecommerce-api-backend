const multer = require('multer');
const path = require('path');
const productDb = require('../model/productModel');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "products");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

const upload = multer({ storage: storage }).array("Images", 5);

exports.create = async (req, res) => {
    upload(req, res, async (error) => {
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ error: "image error" + error });
        } else if (error) {
            return res.status(500).json({ error: "server error" + error });
        }

        try {
            const requireFields = ["name",
                "categoryId",
                "price",
            ];
            for (const field of requireFields) {
                if (!req.body[field]) {
                    return res
                        .status(400)
                        .send({ message: `Error: Missing ${field} field` });
                }
            }
            const productImages = req.files.map(file => (file.filename));

            const product = new productDb({
                name: req.body.name,
                categoryId: req.body.categoryId,
                price: req.body.price,
                discount: req.body.discount,
                specifications: req.body.specifications,
                images: productImages,
            });

            product
                .save(product)
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred during creating category",
                    });
                });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    });
};

// upload 
exports.update = async (req, res) => {
    const id = req.params.id;
    let productImages;
    upload(req, {}, async (error) => {
        // console.log(req.files)

        if (error instanceof multer.MulterError) {
            return res.status(400).json({ error: "image error" + error });
        } else if (error) {
            return res.status(500).json({ error: "server error" + error })
        }

        try {
            if (req.files) {
                productImages = req.files.map(file => (file.filename));

            }
            const product = await productDb.findById(id);
            console.log("product",product)
            // console.log(req.files)
            if (!product) {
                return res.status(400).send({ message: `error while updating product` });

            }
            const updatedProduct = {
                ...req.body,
                images: productImages
            }
            const updated = await productDb.findByIdAndUpdate(id, updatedProduct, { new: true });
            res.status(200).json(updated);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "server error" });
        }
    });
}

// find by category id
exports.findByCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const products = await productDb.aggregate([
            {
                $match: {
                    categoryId: categoryId
                },
                // $lookup :{
                //     from : 'category',
                //     localField : 'categoryId',
                //     foreignField : '_id',
                //     as : 'category'
                // }
            }
        ]).exec();
        console.log(products);

        // const product = products[0];

        res.status(200).json(products);
    } catch (error) {
        // Handle errors, for example:
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


exports.remove = async (req, res) => {
    const id = req.params.id;
    productDb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `cannot delete product with id` + id })
            }
            else {
                res.send({
                    message: "product deleted successfully"
                })
            }
        }).catch(err => {
            res.status(500).send({
                message: "cannot delete product" + err
            });
        });
};