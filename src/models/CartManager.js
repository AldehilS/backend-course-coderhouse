import fs from "fs";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async createCart(products) {
    try {
      let carts = await fs.promises.readFile(this.path, "utf-8");

      if (carts.length === 0) {
        carts = [];
      } else {
        carts = JSON.parse(carts);
      }
      
      const id = carts.length === 0 ? 0 : carts[carts.lenght - 1] + 1;

      const newCart = { id: id, products: products };

      carts.push(newCart);

      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 4));

      return id;
    } catch (error) {
      console.error(error);
      throw new Error("Error creating cart");
    }
  }
}
