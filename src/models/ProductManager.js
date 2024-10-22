import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return data.trim().length === 0 ? [] : JSON.parse(data);
    } catch (error) {
      console.error("Error reading file", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product.id == id);

      if (!product) {
        console.error("Not found");
        return;
      }

      return product;
    } catch (error) {
      console.error("Error getting product by id", error);
      throw error;
    }
  }

  async addProduct({ title, description, code, price, status, stock, category, thumbnails }) {
    try {
      const products = await this.getProducts();
      const id = products.length == 0 ? 1 : products[products.length - 1].id + 1;

      products.push({ id, title, description, code, price, status, stock, category, thumbnails });

      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 4));

      return id;
    } catch (error) {
      console.error("Error adding product", error);
      throw error;
    }
  }

  async updateProduct(id, newFields) {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex((product) => product.id == id);

      if (productIndex === -1) {
        console.error("Product not found");
        return;
      }

      products[productIndex] = { ...products[productIndex], ...newFields };

      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 4));

      return products[productIndex];
    } catch (error) {
      console.error("Error updating product", error);
      throw error;
    }
  }
}
