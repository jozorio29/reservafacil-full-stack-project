import express from "express";
import {
  crearServicio,
  obtenerServicios,
} from "../controllers/service.controller.js";
import { proteger, soloAdminOBarbero } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", proteger, soloAdminOBarbero, crearServicio);
router.get("/", obtenerServicios);

export default router;