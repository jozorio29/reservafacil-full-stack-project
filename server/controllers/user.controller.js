import User from "../models/user.model.js";

const obtenerBaberos = async (req, res) => {
  try {
    const barberos = await User.find({ rol: "barbero" }).select(
      "nombre correo telefono"
    );
    res.status(200).json(barberos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los barberos", error });
  }
};

export { obtenerBaberos };
