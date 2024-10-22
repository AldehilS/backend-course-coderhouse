import CartManager from "../models/CartManager.js";
import path from 'path'
import { fileURLToPath } from "url";

const productsPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "data",
  "carritos.json"
);

const cartManager = new CartManager(productsPath);

export const createCart = async (req, res) => {
  try {
    const { products } = req.body;

    // Validate that products exists and is an array
    if (!products || !Array.isArray(products)) {
      res.status(400).json({ error: "Products must be an array" });
      return;
    }
    
    // Validate that products is an array of objects
    if (!products.every((product) => typeof product === "object")) {
      res.status(400).json({ error: "Products must be an array of objects" });
      return;
    }

    // TODO: Could be added a validation to prove it is an array of type products

    const id = await cartManager.createCart(products);

    res.json({ id: id, message: "Cart created succesfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating your cart' });
  }
};
