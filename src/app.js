import express from "express";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from './routes/cartsRouter.js';
import handlebars from "express-handlebars";
import path from 'path';
import { fileURLToPath } from 'url';
import viewsRouter from "./routes/viewsRouter.js";
import { Server } from "socket.io";
import ProductManager from "./models/ProductManager.js";

const app = express();
const PORT = 8080;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.json())
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)
app.use(express.static(path.join(__dirname, 'public')));

const productsPath = path.join(__dirname, 'data', 'products.json');
const productManager = new ProductManager(productsPath);

const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const io = new Server(httpServer);

io.on('connection', async (socket) => {
  console.log('Cliente conectado:', socket.id);

  try {
    const products = await productManager.getProducts();
    socket.emit('products', products);
  } catch (error) {
    console.error('Error getting products', error);
  }
});