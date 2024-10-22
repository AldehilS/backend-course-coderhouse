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

  async addProduct(cartId, productId) {
    try {
      let carts = await fs.promises.readFile(this.path, "utf-8");

      if (carts.length === 0) {
        carts = [];
      } else {
        carts = JSON.parse(carts);
      }

      const cart = carts.find((cart) => {
        cart.id === cartId;
      });

      if (!cart) {
        throw new Error("Cart not found");
      }

      const { products } = cart.products;

      // Check if product is already in cart
      const product = products.find((product) => {
        product.id === productId;
      });

      if (product) {
        product.quantity++;
      } else {
        products.push({ id: productId, quantity: 1 });
      }

      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 4));

    } catch (error) {}
  }
}
