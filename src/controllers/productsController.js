import productManager from "../dao/ProductMongoManager.js";

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
  let { limit, page, query, sort } = req.query;
  try {
    if (!limit) {
      limit = 10;
    }

    if (!page) {
      page = 1;
    }

    if (!sort) {
      sort = null;
    }

    if (sort !== null && sort !== "asc" && sort !== "desc") {
      res.status(400).json({ error: "Invalid sort value" });
      return;
    }

    if (query) {
      try {
        query = JSON.parse(query);
      } catch (error) {
        res.status(400).json({ status: "error", error: "Invalid query" });
        return;
      }
    } else {
      query = {};
    }

    let priceSort = {};
    if (sort === "asc") {
      priceSort = { price: 1 };
    } else if (sort === "desc") {
      priceSort = { price: -1 };
    }

    const mongoProducts = await productManager.getProducts(limit, page, priceSort, query);

    /**
     * Convert the products to the format that the frontend expects
     * With the following format:
     * {
	        status:success/error
          payload: Resultado de los productos solicitados
          totalPages: Total de páginas
          prevPage: Página anterior
          nextPage: Página siguiente
          page: Página actual
          hasPrevPage: Indicador para saber si la página previa existe
          hasNextPage: Indicador para saber si la página siguiente existe.
          prevLink: Link directo a la página previa (null si hasPrevPage=false)
          nextLink: Link directo a la página siguiente (null si hasNextPage=false)
      }
    */
    const products = {
      status: "success",
      payload: mongoProducts.docs,
      totalPages: mongoProducts.totalPages,
      prevPage: mongoProducts.prevPage,
      nextPage: mongoProducts.nextPage,
      page: mongoProducts.page,
      hasPrevPage: mongoProducts.hasPrevPage,
      hasNextPage: mongoProducts.hasNextPage,
      prevLink: mongoProducts.hasPrevPage
        ? `/products?limit=${limit}&page=${mongoProducts.prevPage}`
        : null,
      nextLink: mongoProducts.hasNextPage
        ? `/products?limit=${limit}&page=${mongoProducts.nextPage}`
        : null,
    };

    res.json(products);
  } catch (error) {
    res.status(500).json({ status: "error", error: "Error getting products" });
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
  const missingFields = [];

  if (!title) missingFields.push("title");
  if (!description) missingFields.push("description");
  if (!code) missingFields.push("code");
  if (!price) missingFields.push("price");
  if (!stock) missingFields.push("stock");
  if (!category) missingFields.push("category");

  if (missingFields.length > 0) {
    res
      .status(400)
      .json({ error: `Missing fields: ${missingFields.join(", ")}` });
    return;
  }

  // status has a default value of true
  status = status ? status : true;

  // thumbnails is and optional field
  thumbnails = thumbnails ? thumbnails : [];

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
    const addedProduct = await productManager.addProduct(newProduct);
    res.json({
      addedProduct: addedProduct,
      message: "Product added successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding product", detail: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { pid: id } = req.params;
  const newFields = req.body;

  try {
    const product = await productManager.getProductById(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    await productManager.updateProduct(id, newFields);
    const updatedProduct = await productManager.getProductById(id);
    res.json({ message: "Product updated successfully", updatedProduct: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: "Error updating product", detail: error.message });
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

    const deletedProduct = await productManager.deleteProduct(id);

    res.json({ message: "Product deleted successfully", deleteProduct: deletedProduct });
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" });
  }
};
