import { Router } from "express";
import { createCart } from "../controllers/cartsController.js";

const router = new Router();

router.post('/', createCart)

export default router;