import express from "express";
import {
  cancelarReserva,
  completarReserva,
  crearReserva,
  obtenerReservasPorCliente,
  obtenerTurnoDelBarbero,
} from "../controllers/reservation.controller.js";
import { proteger } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", proteger, crearReserva);
router.get("/mis-reservas", proteger, obtenerReservasPorCliente);
router.patch("/:id/completar", proteger, completarReserva);
router.patch("/:id/cancelar", proteger, cancelarReserva);
router.get("/mis-turnos", proteger, obtenerTurnoDelBarbero);

export default router;
