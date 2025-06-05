import Reservation from "../models/reservation.model.js";

const obtenerDisponibilidad = async (req, res) => {
  const { id } = req.params;
  const { fecha } = req.query; // formato esperado: '2025-06-01'

  if (!fecha) {
    return res.status(400).json({ mensaje: "Debe proporcionar una fecha" });
  }

  const diaSemana = new Date(fecha).getDay();

  if (diaSemana === 6) {
    return res
      .status(400)
      .json({ mensaje: "El barbero no trabaja los domingos" });
  }

  try {
    const inicioJornada = 7; // 7 AM
    const finJornada = 20; // 8 PM
    const duracionBloque = 40; // 40 minutos

    // Obtener las reservas del barbero ese dia
    const inicioDia = new Date(
      `${fecha}T${inicioJornada.toString().padStart(2, "0")}:00:00`
    );
    const finDia = new Date(
      `${fecha}T${finJornada.toString().padStart(2, "0")}:00:00`
    );

    const reservas = await Reservation.find({
      barbero: id,
      fechaHora: {
        $gte: inicioDia,
        $lt: finDia,
      },
      estado: { $ne: "cancelada" }, // Excluir reservas canceladas
    });

    // Generar bloques de tiempo disponibles
    const bloquesDisponibles = [];

    let bloqueActual = new Date(inicioDia);
    const ahora = new Date();

    // Si la fecha es hoy, empezamos desde ahora mismo (ajustado al próximo múltiplo de 40)
    if (inicioDia.toDateString() === ahora.toDateString()) {
      bloqueActual = new Date(
        Math.ceil(ahora.getTime() / (40 * 60 * 1000)) * (40 * 60 * 1000)
      );
    }

    while (bloqueActual < finDia) {
      const finBloque = new Date(
        bloqueActual.getTime() + duracionBloque * 60 * 1000
      );

      const hayConflicto = reservas.some((reserva) => {
        const inicioReserva = new Date(reserva.fechaHora);
        const finReserva = new Date(
          inicioReserva.getTime() + duracionBloque * 60 * 1000
        );

        return bloqueActual < finReserva && finBloque > inicioReserva;
      });

      if (!hayConflicto) {
        bloquesDisponibles.push(new Date(bloqueActual));
      }

      bloqueActual = new Date(
        bloqueActual.getTime() + duracionBloque * 60 * 1000
      );
    }

    if (bloquesDisponibles.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No hay más horarios disponibles para este barbero" });
    }

    res.json({ bloquesDisponibles });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener la disponibilidad", error });
  }
};

const obtenerNotificacionesBarbero = async (req, res) => {
  if (req.usuario.rol !== "barbero") {
    return res.status(403).json({ mensaje: "Acceso denegado" });
  }

  const cantidad = await Reservation.countDocuments({
    barbero: req.usuario._id,
    vistoPorBarbero: false,
  });

  res.json({ cantidad });
};

const notificacionesVistas = async (req, res) => {
  if (req.usuario.rol !== "barbero") {
    return res.status(403).json({ mensaje: "Acceso denegado" });
  }

  await Reservation.updateMany(
    { barbero: req.usuario._id, vistoPorBarbero: false },
    { $set: { vistoPorBarbero: true } } // modifica solo el campo vistoPorBarbero
  );
  res.json({ mensaje: "Notificaciones vistas" });
};

export {
  obtenerDisponibilidad,
  obtenerNotificacionesBarbero,
  notificacionesVistas,
};
