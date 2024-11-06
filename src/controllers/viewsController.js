import ProductManager from "../models/ProductManager.js";
import path from "path";
import { fileURLToPath } from "url";

const productsPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "data",
  "products.json"
);
const productManager = new ProductManager(productsPath);

export const getHome = async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { products });
  } catch (error) {
    res.status(500).json({ error: "Error getting products" });
  }
};

export const getRealTimeProducts = (req,res) => {
  res.render('realTimeProducts');
}
