const cartDb = require("../model/cartSchema");
const mongoose = require("mongoose");

// create and update cart
exports.create = async (req, res) => {
  const { userId, id, quantity } = req.body;
  try {
      let cart = await cartDb.findOne({ userId });

      if (!cart) {
          cart = await cartDb.create({ userId, items: [{ id: id, quantity }] });
          return res.status(201).json(cart);
      }
      const updatedCart = await cartDb.findOneAndUpdate(
          { userId, 'products.id': id },
          { $inc: { 'products.$.quantity': quantity } },
          { new: true }
      );
      if (!updatedCart) {
          await cartDb.findOneAndUpdate(
              { userId },
              { $push: { products: {  id, quantity } } }
          );
      }
      const finalCart = await cartDb.findOne({ userId });

      res.status(200).json(finalCart);
  } catch (error) {
      res.status(500).json({ error: "Internal server error" });
  }
};

// update quanitty
exports.updateQuantity = async (req, res) => {
  const { userId, id } = req.body;
  const { action } = req.params;
  try {
      let updateQuery = {};

      if (action === 'increment') {
          updateQuery = { $inc: { 'products.$.quantity': 1 } };
      } else if (action === 'decrement') {
          updateQuery = { $inc: { 'products.$.quantity': -1 } };
      } else {
          return res.status(400).json({ error: "Invalid action" });
      }
      const updatedCart = await cartDb.findOneAndUpdate(
          { userId, 'products.id': id },
          updateQuery,
          { new: true }
      );

      if (!updatedCart) {
          return res.status(404).json({ error: "Product not found in cart" });
      }

      res.status(200).json(updatedCart);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
  }
};

// find all items in cart
// exports.find = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const cart = await cartDb
//       .aggregate([
//         {
//           $match: {
//             userId: userId,
//           },
//         },
//         {
//           $lookup: {
//             from: "products",
//             localField: "products.id",
//             foreignField: "_id",
//             as: "cart_products",
//           },
//         },
//       ])
//       .exec();
//     res.status(200).json(cart[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "internal server error" });
//   }
// };



// find all items in cart
exports.find = async (req, res) => {
  try {
      const id = req.params.id;
      const userId = new mongoose.Types.ObjectId(id);
      
      const userCartsAggregate = await cartDb.aggregate([
          {
              $match: { userId: userId }
          },
          {
              $unwind: "$products"
          },
          {
              $lookup: {
                  from: 'products',
                  localField: 'products.id',
                  foreignField: '_id',
                  as: 'cartItems'
              }
          },
          {
              $group: {
                  _id: "$_id",
                  totalQuantity: { $sum: "$products.quantity" },
                  products: {
                      $push: {
                          _id: "$products._id",
                          quantity: "$products.quantity",
                          cartItems: { $arrayElemAt: ["$cartItems", 0] }
                      }
                  }
              }
          }
      ]);
      if (userCartsAggregate.length === 0) {
          return res.status(200).json({ userCarts: [], totalQuantity: 0 });
      }
      const { totalQuantity } = userCartsAggregate[0];
      
      res.status(200).json({ userCarts: userCartsAggregate, totalQuantity });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
  }
};


// Remove a product from the cart
exports.removeProduct = async (req, res) => {
  const { userId, id } = req.body;
  try {
      let cart = await cartDb.findOne({ userId });

      if (!cart) {
          return res.status(404).json({ error: "Cart not found" });
      }
      const updatedCart = await cartDb.findOneAndUpdate(
          { userId, 'products.id': id },
          { $pull: { products: { id: id } } },
          { new: true }
      );

      if (!updatedCart) {
          return res.status(404).json({ error: "Product not found in cart" });
      }

      res.status(200).json(updatedCart);
  } catch (error) {
      res.status(500).json({ error: "Internal server error" });
  }
};
// exports.removeProduct = async (req, res) => {
//     const { userId, productId } = req.body;

//     try {
//         let cart = await cartDb.findOneAndUpdate(
//             { userId },
//             { $pull: { products: { id: new mongoose.Types.ObjectId(productId) } } },
//             { new: true } 
//         );

//         if (!cart) {
//             return res.status(404).send("Cart not found for the user");
//         }

//         return res.status(200).send("Product removed successfully");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Something went wrong");
//     }
// };