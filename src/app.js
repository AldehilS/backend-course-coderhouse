import express from "express";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import handlebars from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import viewsRouter from "./routes/viewsRouter.js";
import { Server } from "socket.io";
import ProductManager from "./dao/ProductManager.js";
import {
  fieldSchema,
  validateField,
} from "./controllers/productsController.js";
import dbConnection from "./dbConnection.js";
import { config } from "./config/config.js";

const app = express();
const PORT = config.port;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use(express.static(path.join(__dirname, "public")));

const productsPath = path.join(__dirname, "data", "products.json");
const productManager = new ProductManager(productsPath);

dbConnection(config.db.host, config.db.database);

const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("Cliente conectado:", socket.id);

  try {
    const products = await productManager.getProducts();
    socket.emit("products", products);
  } catch (error) {
    console.error("Error getting products", error);
  }

  socket.on("new-product", async (product) => {
    try {
      const { title, description, code, price, stock, category } = product;
      let { thumbnails, status } = product;

      // Validate that all fields exists. thumbnails and status are optional
      if (!title || !description || !code || !price || !stock || !category) {
        socket.emit("error", { error: "All fields are required" });
        return;
      }

      // Validate that all fields are of the correct type
      if (
        !Object.keys({
          title,
          description,
          code,
          price,
          stock,
          category,
        }).every((key) => validateField(product[key], fieldSchema[key].type))
      ) {
        socket.emit("error", { error: "Invalid field type" });
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
        socket.emit("error", { error: "Invalid thumbnails" });
        return;
      }

      // Validate that status is of the correct type
      if (!validateField(status, fieldSchema.status.type)) {
        socket.emit("error", { error: "Invalid status" });
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
          socket.emit("error", { error: "Code already exists" });
          return;
        }
    
        const productId = await productManager.addProduct(newProduct);
        const updatedProducts = await productManager.getProducts();
        io.emit("products", updatedProducts);
        console.log("Udated products", updatedProducts);
      } catch (error) {
        socket.emit("error", { error: "Error adding product" });
      }
    } catch (error) {
      console.error("Error adding product", error);
      socket.emit("error", { error: "Error adding product" });
    }
  });

  socket.on("delete-product", async (id) => {
    try {
      const product = await productManager.getProductById(id);
  
      if (!product) {
        socket.emit("error", { error: "Product not found" });
        return;
      }
  
      await productManager.deleteProduct(id);
  
      io.emit("products", await productManager.getProducts());
    } catch (error) {
      socket.emit("error", { error: "Error deleting product" });
    }
  });
});
