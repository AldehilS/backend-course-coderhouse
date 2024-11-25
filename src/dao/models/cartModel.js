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

export const cartModel = mongoose.model(cartCollection, cartSchema);
