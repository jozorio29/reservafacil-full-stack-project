import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNotificaciones } from "@/context/NotificacionContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaCut, FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import { server } from "@/constants/config";

const socket = io(import.meta.env.VITE_SERVER_URL);

const Dashboard = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [resumen, setResumen] = useState({
    reservasActivas: 0,
    serviciosDisponibles: 0,
    barberosRegistrados: 0,
  });

  const { usuario } = useAuth();
  const navigate = useNavigate();
  const { cantidadNotificaciones, setCantidadNotificaciones } =
    useNotificaciones();

  useEffect(() => {
    console.log("🌀 useEffect montado en Dashboard");
    const fetchResumen = async () => {
      try {
        const debugResponse = await axios.get(`${server}/api/auth/cookies`, {
          withCredentials: true,
        });
        console.log("🔍 Cookies de depuración:", debugResponse.data);
      } catch (error) {
        console.error("Error al obtener las cookies de depuración:", error);
      }
      try {
        const response = await axios.get(`${server}/api/dashboard/resumen`, {
          withCredentials: true, // ✅ necesario para enviar la cookie
        });
        setResumen(response.data);
        setNombreUsuario(response.data.nombreUsuario);
      } catch (error) {
        console.error("Error al obtener el resumen:", error);
      }
    };
    fetchResumen();
  }, []);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario?.rol === "barbero") {
      socket.emit("unirse-barbero", usuario._id);
    }

    const manejarNuevaReserva = (reserva) => {
      toast.success("Nueva reserva");
      setCantidadNotificaciones((prev) => prev + 1); // aumenta el contador
      cargarTurnos();
    };

    socket.on("nueva-reserva", manejarNuevaReserva);

    return () => {
      socket.off("nueva-reserva", manejarNuevaReserva);
    };
  }, []);

  useEffect(() => {
    const obtenerNotificaciones = async () => {
      try {
        const response = await axios.get(
          `${server}/api/barberos/notificaciones-barbero`,
          {
            withCredentials: true,
          }
        );
        setCantidadNotificaciones(response.data.cantidad);
      } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
      }
    };

    obtenerNotificaciones();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${server}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Botón de logout */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 text-gray-600 dark:text-white hover:text-red-600 transition"
        title="Cerrar sesión"
      >
        <FiLogOut size={24} />
      </button>

      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            ¡Hola, {nombreUsuario}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            ¿Qué te gustaría hacer hoy?
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate("/barberos")}
          >
            <CardContent className="flex flex-col items-center p-6">
              <FaUser size={40} className="mb-2 text-blue-600" />
              <h2 className="text-lg font-semibold">Ver barberos</h2>
            </CardContent>
          </Card>
          <Card
            className="hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate("/servicios")}
          >
            <CardContent className="flex flex-col items-center p-6">
              <FaCut size={40} className="mb-2 text-green-600" />
              <h2 className="text-lg font-semibold">Ver servicios</h2>
            </CardContent>
          </Card>
          <Card
            className="hover:shadow-lg transition cursor-pointer"
            onClick={() =>
              navigate(
                usuario?.rol === "barbero" ? "/panel-barbero" : "/mis-reservas"
              )
            }
          >
            <CardContent className="flex flex-col items-center p-6 relative">
              <div className="relative">
                <FaCalendarAlt size={40} className="mb-2 text-purple-600" />
                {cantidadNotificaciones > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cantidadNotificaciones}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-semibold mt-1">Mis reservas</h2>
            </CardContent>
          </Card>
        </div>

        <section className="mt-10">
          <Card className="p-6 bg-white dark:bg-gray-900 shadow">
            <CardHeader>
              <CardTitle>Resumen rápido</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {resumen.reservasActivas}
                </p>
                <p>Reservas activas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {resumen.serviciosDisponibles}
                </p>
                <p>Servicios disponibles</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {resumen.barberosRegistrados}
                </p>
                <p>Barberos registrados</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
