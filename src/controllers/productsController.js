import ProductManager from "../dao/ProductManager.js";
import path from "path";
import { fileURLToPath } from "url";

const productsPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "data",
  "products.json"
);
const productManager = new ProductManager(productsPath);

export function validateField(value, type) {
  return typeof value === type;
}

export const fieldSchema = {
  title: { type: "string" },
  description: { type: "string" },
  code: { type: "string" },
  price: { type: "number" },
  stock: { type: "number" },
  category: { type: "string" },
  thumbnails: { type: "array" },
  status: { type: "boolean" },
};

export const getProducts = async (req, res) => {
  const limit = req.query.limit;
  try {
    const products = await productManager.getProducts();
    res.json(products.slice(0, limit ? limit : products.length));
  } catch (error) {
    res.status(500).json({ error: "Error getting products" });
  }
};

export const getProductById = async (req, res) => {
  const { pid: id } = req.params;

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
};

export const addProduct = async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;
  let { thumbnails, status } = req.body;

  // Validate that all fields exists. thumbnails and status are optional
  if (!title || !description || !code || !price || !stock || !category) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  // Validate that all fields are of the correct type
  if (
    !Object.keys({ title, description, code, price, stock, category }).every(
      (key) => validateField(req.body[key], fieldSchema[key].type)
    )
  ) {
    res.status(400).json({ error: "Invalid fields" });
    return;
  }

  // status has a default value of true
  status = status ? status : true;

  // thumbnails is and optional field
  thumbnails = thumbnails ? thumbnails : [];

  // Validate that all thumbnails are of the correct type
  if (
    !Array.isArray(thumbnails) ||
    !thumbnails.every((thumbnail) => typeof thumbnail === "string")
  ) {
    res.status(400).json({ error: "Invalid thumbnails" });
    return;
  }

  // Validate that status is of the correct type
  if (!validateField(status, fieldSchema.status.type)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  const newProduct = {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    status,
  };
  try {
    // Validate that the code is unique
    const products = await productManager.getProducts();
    if (products.some((product) => product.code === code)) {
      res.status(400).json({ error: "Code already exists" });
      return;
    }

    const productId = await productManager.addProduct(newProduct);
    res.json({ id: productId, message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding product" });
  }
};

export const updateProduct = async (req, res) => {
  const { pid: id } = req.params;
  const newFields = req.body;

  const validFields = [
    "title",
    "description",
    "code",
    "price",
    "stock",
    "category",
    "thumbnails",
    "status",
  ];

  // Delete fields that are not valid
  Array.from(Object.keys(newFields)).forEach((key) => {
    if (!validFields.includes(key)) delete newFields[key];
  });

  // for each new field, validate that it is either undefined or of the correct type, if the field is thumbnails, validate that all thumbnails are of the correct type
  for (const [key, value] of Object.entries(newFields)) {
    if (key === "thumbnails") {
      if (
        !Array.isArray(value) ||
        !value.every((thumbnail) => typeof thumbnail === "string")
      ) {
        res.status(400).json({ error: "Invalid thumbnails" });
        return;
      }
    } else {
      if (value !== undefined && !validateField(value, fieldSchema[key].type)) {
        res.status(400).json({ error: "Invalid fields" });
        return;
      }
    }
  }

  try {
    const product = await productManager.getProductById(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    await productManager.updateProduct(id, newFields);
    res.json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating product" });
  }
};

export const deleteProduct = async (req, res) => {
  const { pid: id } = req.params;

  try {
    const product = await productManager.getProductById(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    await productManager.deleteProduct(id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" });
  }
};
