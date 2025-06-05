import Reservation from "../models/reservation.model.js";
import Service from "../models/service.model.js";
import User from "../models/user.model.js";
import { io } from "../server.js";

const crearReserva = async (req, res) => {
  const { barbero, servicio, fechaHora } = req.body;

  try {
    // Validad si el barbero existe y es barbero
    const barberoExistente = await User.findById(barbero);
    if (!barberoExistente || barberoExistente.rol !== "barbero") {
      return res.status(400).json({ mensaje: "Babero no válido" });
    }

    // Validar si el servicio existe
    const servicioExiste = await Service.findById(servicio);
    if (!servicioExiste) {
      return res.status(400).json({ mensaje: "Servicio no válido" });
    }

    // Verificar si ya existe una reserva en ese horario
    const inicioNuevaReserva = new Date(fechaHora);
    const finNuevaReserva = new Date(
      inicioNuevaReserva.getTime() + 40 * 60 * 1000
    );

    const reservas = await Reservation.find({
      barbero,
      estado: { $ne: "cancelada" }, // Excluir reservas canceladas
    });

    const hayConflicto = reservas.some((reserva) => {
      const inicioReserva = new Date(reserva.fechaHora);
      const finReserva = new Date(inicioReserva.getTime() + 40 * 60 * 1000);

      return inicioNuevaReserva < finReserva && finNuevaReserva > inicioReserva;
    });

    if (hayConflicto) {
      return res
        .status(409)
        .json({ mensaje: "Ya existe una reserva en ese horario" });
    }

    const nuevaReserva = await Reservation.create({
      cliente: req.usuario._id,
      barbero,
      servicio,
      fechaHora: new Date(fechaHora),
    });

    const reservaConCliente = await nuevaReserva.populate("cliente", "nombre");

    io.to(barbero).emit("nueva-reserva", reservaConCliente);

    res.status(201).json(nuevaReserva);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear la reserva", error });
  }
};

const obtenerReservasPorCliente = async (req, res) => {
  try {
    const reservas = await Reservation.find({ cliente: req.usuario._id })
      .populate("barbero", "nombre")
      .populate("servicio", "nombre precio");
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las reservas", error });
  }
};

const completarReserva = async (req, res) => {
  try {
    const reserva = await Reservation.findById(req.params.id);

    if (!reserva) {
      return res.status(404).json({ mensaje: "Reserva no encontrada" });
    }

    // Solo puede completarla un barbero o admin
    if (!["barbero", "admin"].includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }

    if (reserva.estado !== "pendiente") {
      return res
        .status(400)
        .json({ mensaje: "No se puede completar la reserva" });
    }

    reserva.estado = "finalizado";
    await reserva.save();

    res.json({ mensaje: "Reserva completada" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al completar la reserva", error });
  }
};

const cancelarReserva = async (req, res) => {
  try {
    const reserva = await Reservation.findById(req.params.id);

    if (!reserva) {
      return res.status(404).json({ mensaje: "Reserva no encontrada" });
    }

    // Solo puede cancelar el cliente que lo hizo
    if (reserva.cliente.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }

    // Solo se puede cancelar si esta pendiente
    if (reserva.estado !== "pendiente") {
      return res
        .status(400)
        .json({ mensaje: "No se puede cancelar la reserva" });
    }

    reserva.estado = "cancelada";
    await reserva.save();

    res.json({ mensaje: "Reserva cancelada" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al cancelar la reserva", error });
  }
};

const obtenerTurnoDelBarbero = async (req, res) => {
  if (req.usuario.rol !== "barbero") {
    return res.status(403).json({ mensaje: "Acceso denegado" });
  }
  try {
    const reservas = await Reservation.find({ barbero: req.usuario._id })
      .populate("cliente", "nombre telefono")
      .populate("servicio", "nombre");
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener turnos", error });
  }
};

export {
  crearReserva,
  obtenerReservasPorCliente,
  cancelarReserva,
  completarReserva,
  obtenerTurnoDelBarbero,
};
