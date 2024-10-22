import ProductManager from "../models/ProductManager.js";
import path from "path";
import { fileURLToPath } from "url";

const productsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..','data', "products.json");
const productManager = new ProductManager(productsPath);

export const getProducts = async (req, res) => {
  try {
    const limit = req.query.limit;

    const products = await productManager.getProducts();
    res.json(products.slice(0, limit ? limit : products.length));
  } catch (error) {
    res.status(500).json({ error: "Error getting products" });
  }
}

export const getProductById = async (req, res) => {
  const { pid:id } = req.params;

  try {
    const product = await productManager.getProductById(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    } else {
      res.json(product);
    }

  } catch (error) {
    res.status(500).json({ error: "Error getting product by id" });
  }
}

