import Reservation from "../models/reservation.model.js";
import Service from "../models/service.model.js";
import User from "../models/user.model.js";

const obtenerResumenDashboard = async (req, res) => {
  try {
    const reservasActivas = await Reservation.countDocuments({
      estado: "pendiente",
    });
    const serviciosDisponibles = await Service.countDocuments({ activo: true });
    const barberosRegistrados = await User.countDocuments({ rol: "barbero" });

    const nombreUsuario = req.usuario.nombre;

    res.status(200).json({
      reservasActivas,
      serviciosDisponibles,
      barberosRegistrados,
      nombreUsuario,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el resumen del dashboard", error });
  }
};

export { obtenerResumenDashboard };
