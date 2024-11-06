import { Router } from "express";
import { getHome } from "../controllers/viewsController.js";

const router = new Router();

router.get('/', getHome);

export default router;