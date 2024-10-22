import { Router } from "express";
import { getProductById, getProducts } from "../controllers/productsController.js";

const router = new Router();

router.get('/', getProducts);
router.get('/:pid', getProductById);

export default router;
