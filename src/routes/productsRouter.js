import { Router } from "express";
import { addProduct, getProductById, getProducts, updateProduct } from "../controllers/productsController.js";

const router = new Router();

router.get('/', getProducts);
router.get('/:pid', getProductById);
router.post('/', addProduct);
router.put('/:pid', updateProduct);

export default router;
