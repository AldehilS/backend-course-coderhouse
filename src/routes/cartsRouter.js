import { Router } from "express";
import { addProduct, createCart } from "../controllers/cartsController.js";

const router = new Router();

router.post('/', createCart)
router.post('/:cid/product/:pid', addProduct)

export default router;