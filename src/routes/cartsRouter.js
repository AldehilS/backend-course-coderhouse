import { Router } from "express";
import { addProduct, createCart, getCart } from "../controllers/cartsController.js";

const router = new Router();

router.post('/', createCart);
router.post('/:cid/product/:pid', addProduct);
router.get('/:cid', getCart);

export default router;