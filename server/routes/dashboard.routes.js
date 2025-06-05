import express from "express";
import { proteger } from "../middlewares/auth.js";
import { obtenerResumenDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/resumen", proteger, obtenerResumenDashboard);

export default router;
