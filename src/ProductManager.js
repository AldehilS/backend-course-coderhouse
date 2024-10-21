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
      return;
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
      return;
    }
  }

  async addProduct({ title, description, price, thumbnail, code, stock }) {
    try {
      // Validation of all fields
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.error("Missing data");
        return;
      }

      const product = await this.getProducts();

      // Check that code is unique
      const repeatedCode = product.find((product) => product.code === code);

      if (repeatedCode) {
        console.error("Code already exists");
        return;
      }

      const id = product.length == 0 ? 1 : product[product.length - 1].id + 1;

      product.push({ id, title, description, price, thumbnail, code, stock });

      await fs.promises.writeFile(this.path, JSON.stringify(product, null, 4));

      return id;
    } catch (error) {
      console.error("Error adding product", error);
      return;
    }
  }
}
