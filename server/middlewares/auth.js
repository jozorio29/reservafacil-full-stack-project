import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const proteger = async (req, res, next) => {
  console.log("🔐 Cookies recibidas:", req.cookie); // agrega esto
  const token = req.cookie.token;

  console.log("🔐 Middleware proteger, token recibido:", token);

  if (!token) {
    console.log("⛔ No hay token en la petición");
    return res.status(401).json({ mensaje: "No hay token en la peticion" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = await User.findById(decoded.id).select("-password");
    console.log("✅ Token válido, usuario:", decoded.id);

    if (!req.usuario) {
      return res.status(404).json({ mensaje: "Usuario no válido" });
    }

    next();
  } catch (error) {
    console.log("Error al verificar el token desde cookie", error);
    res.status(401).json({ mensaje: "Token inválido" });
  }
};

const soloAdminOBarbero = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ mensaje: "No hay usuario en la peticion" });
  }

  if (req.usuario.rol === "admin" || req.usuario.rol === "barbero") {
    return next();
  }
  return res.status(403).json({ mensaje: "Acceso denegado" });
};

export { proteger, soloAdminOBarbero };
