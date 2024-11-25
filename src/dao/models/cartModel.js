import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      id: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
}, { timestamps: true });

const Cart = mongoose.model(cartCollection, cartSchema);
