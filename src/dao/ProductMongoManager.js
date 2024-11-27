import { productsModel } from "./models/productsModel.js";

export default class ProductMongoManager {

  static async addProduct({ title, description, code, price, status, stock, category, thumbnails }) {
    try {
      const value = await productsModel.create({ title, description, code, price, status, stock, category, thumbnails });
      console.log("Product added successfully", value);
      return value;
    } catch (error) {
      console.error("Error adding product", error);
      throw error;
    }
  }

  static async getProducts(limit, page, sort, query) {
    try {
      const products = await productsModel.paginate(query, { limit, page, sort });
      return products;
    } catch (error) {
      console.error("Error getting products", error);
      throw error;
    }
  }

  static async getProductById(id) {
    try {
      const product = await productsModel.findById(id);
      return product;
    } catch (error) {
      console.error("Error getting product by id", error);
      throw error;
    }
  }

  static async deleteProduct(id) {
    try {
      const product = await productsModel.findByIdAndDelete(id);
      return product;
    } catch (error) {
      console.error("Error deleting product", error);
      throw error;
    }
  }

  static async updateProduct(id, newFields) {
    try {
      const product = await productsModel.findByIdAndUpdate(id, newFields)
      return product;
    } catch (error) {
      console.error("Error updating product", error);
      throw error;
    }
  }

}