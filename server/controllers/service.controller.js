import Service from "../models/service.model.js";

const crearServicio = async (req, res) => {
  try {
    const nuevoServicio = await Service.create(req.body);
    res.status(201).json(nuevoServicio);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el servicio", error });
  }
};

const obtenerServicios = async (req, res) => {
  try {
    const servicios = await Service.find({ activo: true });

    const serviciosFormateados = servicios.map((s) => ({
      ...s.toObject(),
      precioFormateado: s.precio.toLocaleString("es-PY"),
    }));

    res.status(200).json(serviciosFormateados);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los servicios", error });
  }
};

export { crearServicio, obtenerServicios };
