import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { server } from "@/constants/config";
import { useNotificaciones } from "@/context/NotificacionContext";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeftCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Phone,
  Scissors,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL);

const PanelBarbero = () => {
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();

  const { setCantidadNotificaciones } = useNotificaciones();

  const cargarTurnos = async () => {
    try {
      const res = await axios.get("/api/reservas/mis-turnos", {
        withCredentials: true,
      });
      setReservas(res.data);
    } catch (error) {
      console.error("Error al obtener los turnos:", error);
      toast.error("Error al obtener los turnos");
    }
  };

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario.rol === "barbero") {
      socket.emit("unirse-barbero", usuario._id);
    }
    const manejarNuevaReserva = (reserva) => {
      toast(
        `Nueva reserva de ${reserva.cliente.nombre} a las ${new Date(
          reserva.fechaHora
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        {
          icon: "✂️",
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#1E293B", // azul grisáceo moderno
            color: "#F8FAFC", // texto casi blanco
            borderLeft: "6px solid #10B981", // verde esmeralda (Tailwind green-500)
            padding: "16px",
          },
        }
      );
      setReservas((prev) => [...prev, reserva]);
    };

    cargarTurnos();

    socket.on("nueva-reserva", manejarNuevaReserva);

    return () => {
      socket.off("nueva-reserva", manejarNuevaReserva);
    };
  }, []);

  useEffect(() => {
    const marcarComoVisto = async () => {
      try {
        await axios.patch(
          "/api/barberos/marcar-visto",
          {},
          {
            withCredentials: true,
          }
        );
        setCantidadNotificaciones(0); // ✅ Reinicia al entrar
      } catch (error) {
        console.error("Error al marcar las notificaciones como vistas:", error);
      }
    };

    marcarComoVisto();
  }, []);

  const completarTurno = async (id) => {
    try {
      await axios.patch(
        `/api/reservas/${id}/completar`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success("Turno atendido");
      cargarTurnos();
    } catch (error) {
      console.error("Error al completar el turno:", error);
      toast.error("No se pudo completar el turno");
    }
  };

  const reservasPorDia = reservas.reduce((acc, reserva) => {
    const fecha = new Date(reserva.fechaHora).toLocaleDateString();

    if (!acc[fecha]) {
      acc[fecha] = []; // si aún no hay reservas ese día, inicializa array
    }
    acc[fecha].push(reserva); // agrega la reserva a ese día
    return acc;
  }, {}); // ← importante: el acumulador empieza como un objeto vacío

  const formatearFecha = (fecha) => {
    const dateObj = new Date(fecha);
    if (isNaN(dateObj.getTime())) {
      return "Fecha inválida";
    }

    const fechaFormateada = new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(dateObj);

    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
  };

  const ordenarFechasAsc = (a, b) => {
    const [diaA, mesA, anioA] = a[0].split("/");
    const [diaB, mesB, anioB] = b[0].split("/");

    const fechaA = new Date(`${anioA}-${mesA}-${diaA}`);
    const fechaB = new Date(`${anioB}-${mesB}-${diaB}`);

    return fechaA - fechaB;
  };

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center text-neutral-800 dark:text-neutral-100">
        Reservas asignadas
      </h1>

      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-800 dark:text-white rounded-full shadow-md transition duration-300"
        >
          <ArrowLeftCircle size={22} />
          <span className="font-medium"></span>
        </button>
      </div>

      {reservas.length === 0 ? (
        <p className="text-center text-gray-500">No tienes turnos asignados.</p>
      ) : (
        Object.entries(reservasPorDia)
          .sort(ordenarFechasAsc)
          .map(([fecha, reservasDelDia]) => (
            <div key={fecha} className="mb-6">
              <h2
                className={`text-xl font-bold px-3 py-1 rounded-md mb-2 ${
                  fecha === new Date().toLocaleDateString()
                    ? "bg-[#CCE4F6] text-blue-900" // Fondo moderno + texto oscuro
                    : "text-neutral-700 dark:text-neutral-100"
                }`}
              >
                {formatearFecha(fecha)}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {reservasDelDia
                  .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))
                  .map((r) => (
                    <motion.div
                      key={r._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="backdrop-blur-sm bg-white/70 dark:bg-neutral-900/60 border border-gray-200 dark:border-gray-700 shadow-md rounded-2xl hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <UserRound className="w-4 h-4" />
                            <span>{r.cliente?.nombre}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Phone className="w-4 h-4" />
                            <span>{r.cliente?.telefono}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Scissors className="w-4 h-4" />
                            <span>{r.servicio?.nombre}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <CalendarDays className="w-4 h-4" />
                            <span>
                              {new Date(r.fechaHora).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(r.fechaHora).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            <span
                              className={`${
                                r.estado === "finalizado"
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {r.estado}
                            </span>
                          </div>
                          {r.estado === "pendiente" && (
                            <Button
                              onClick={() => completarTurno(r._id)}
                              className="w-full mt-2 text-xs font-semibold text-green-600 border border-green-400 rounded-xl hover:bg-green-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-300 bg-transparent"
                            >
                              Finalizar reserva
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))
      )}
    </section>
  );
};

export default PanelBarbero;
