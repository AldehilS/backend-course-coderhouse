import { Router } from "express";
import { getHome, getRealTimeProducts } from "../controllers/viewsController.js";

const router = new Router();

router.get('/', getHome);
router.get('/realtimeproducts', getRealTimeProducts);

export default router;