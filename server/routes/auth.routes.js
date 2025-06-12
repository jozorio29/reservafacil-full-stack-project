import express from "express";
import {
  loginConGoogle,
  loginUsuario,
  logoutUsuario,
  registroUsuario,
} from "../controllers/auth.controller.js";
import { debugCookies } from "../middlewares/auth.js";

const router = express.Router();

router.post("/registro", registroUsuario);
router.post("/login", loginUsuario);
router.post("/logout", logoutUsuario);
router.post("/google-login", loginConGoogle);
router.get("/cookies", debugCookies);

export default router;
