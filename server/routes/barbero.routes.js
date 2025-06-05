import express from "express";
import {
  notificacionesVistas,
  obtenerDisponibilidad,
  obtenerNotificacionesBarbero,
} from "../controllers/barbero.controller.js";
import { proteger } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:id/disponibilidad", proteger, obtenerDisponibilidad);
router.get("/notificaciones-barbero", proteger, obtenerNotificacionesBarbero);
router.patch("/marcar-visto", proteger, notificacionesVistas);

export default router;
