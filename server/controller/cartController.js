const cartDb = require("../model/cartSchema");
const mongoose = require("mongoose");

// create and update cart
exports.create = async (req, res) => {
  const { productId, userId } = req.body;
  let id = new mongoose.Types.ObjectId(productId);

  try {
    let cart = await cartDb.findOne({ userId });

    if (cart) {
      cart.products.push({ id });
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      //if no cart for user
      const newCart = await cartDb.create({
        userId,
        products: [{ id }],
      });
      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong");
  }
};

// find all items in cart
exports.find = async (req, res) => {
  try {
    const userId = req.params.id;
    const cart = await cartDb
      .aggregate([
        {
          $match: {
            userId: userId,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.id",
            foreignField: "_id",
            as: "cart_products",
          },
        },
      ])
      .exec();
    res.status(200).json(cart[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
};


// remove an item from cart
exports.removeProduct = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        let cart = await cartDb.findOneAndUpdate(
            { userId },
            { $pull: { products: { id: new mongoose.Types.ObjectId(productId) } } },
            { new: true } 
        );

        if (!cart) {
            return res.status(404).send("Cart not found for the user");
        }

        return res.status(200).send("Product removed successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
};