import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const proteger = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ mensaje: "No hay token en la peticion" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = await User.findById(decoded.id).select("-password");

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
