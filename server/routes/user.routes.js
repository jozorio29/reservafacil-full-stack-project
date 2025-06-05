import express from "express";
import { obtenerBaberos } from "../controllers/user.controller.js";
import { proteger } from "../middlewares/auth.js";

const router = express.Router();

router.get("/barberos", proteger, obtenerBaberos);

export default router;
