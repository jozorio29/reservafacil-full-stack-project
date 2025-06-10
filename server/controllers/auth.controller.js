import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { cookieOptions } from "../utils/features.js";
import admin from "../config/firebaseAdmin.js";

const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, nombre: usuario.nombre },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const registroUsuario = async (req, res) => {
  const { nombre, correo, password, rol, telefono } = req.body;

  // ✅ Validación manual antes de continuar
  if (!password) {
    return res.status(400).json({ error: "La contraseña es obligatoria" });
  }

  try {
    // Verificar si el correo ya está registrado
    const usuarioExistente = await User.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Crear el nuevo usuario
    const nuevoUsuario = await User.create({
      nombre,
      correo,
      telefono,
      password, // Se hashea automáticamente en el schema
      rol,
    });

    console.log("Nuevo usuario registrado:", nuevoUsuario);

    const token = generarToken(nuevoUsuario);

    res.cookie("token", token, cookieOptions);

    const { password: _, ...usuarioSinPassword } = nuevoUsuario.toObject();

    res.status(201).json({
      success: true,
      mensaje: "Usuario registrado exitosamente",
      usuario: usuarioSinPassword, // aqui ya incluye el rol del usuario
    });
  } catch (error) {
    console.log("Error al registrar el usuario", error);

    res.status(500).json({ mensaje: "Error al registrar el usuario", error });
  }
};

const loginUsuario = async (req, res) => {
  console.log("🟢 Petición recibida en /api/auth/login"); // 👈 Agregá esto
  const { correo, password } = req.body;

  console.log("📥 Intento de login con:", correo); // 🟢

  if (!correo || !password) {
    return res
      .status(400)
      .json({ mensaje: "Correo y contraseña son obligatorios" });
  }

  try {
    const usuario = await User.findOne({ correo });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const esValido = await bcrypt.compare(password, usuario.password);

    if (!esValido) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = generarToken(usuario);
    console.log("✅ Login exitoso. Generando cookie...");

    // Configuración de cookie segura
    res.cookie("token", token, cookieOptions);
    console.log("🍪 Cookie enviada con opciones:", cookieOptions);

    // Omitimos la contraseña antes de enviar al frontend
    const { password: _, ...usuarioSinPassword } = usuario.toObject();

    res.status(200).json({
      success: true,
      mensaje: "Inicio de sesión exitoso",
      usuario: usuarioSinPassword,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ mensaje: "Error al iniciar sesión", error });
  }
};

const loginConGoogle = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const { email, name } = decodedToken;

    // Buscar el usuario en DB por correo
    let usuario = await User.findOne({ correo: email });

    if (!usuario) {
      // Si no existe, crearlo
      usuario = await User.create({
        nombre: name || "Usuario sin nombre",
        correo: email,
        rol: "cliente",
        google: true, // Indicamos que es un usuario de Google
      });
    }

    const token = generarToken(usuario);

    // Configuración de cookie segura
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      success: true,
      mensaje: "Inicio de sesión exitoso",
      usuario,
    });
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    res
      .status(401)
      .json({ mensaje: "Error al iniciar sesión con Google", error });
  }
};
const logoutUsuario = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.status(200).json({ mensaje: "Sesión cerrada exitosamente" });
};

export { loginConGoogle, loginUsuario, logoutUsuario, registroUsuario };
