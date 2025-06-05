import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { server } from "@/constants/config";
import axios from "axios";
import { ArrowLeftCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);

  const navigate = useNavigate();

  const cancelarReserva = async (id) => {
    try {
      await axios.patch(
        `${server}/api/reservas/${id}/cancelar`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success("Reserva cancelada");
      cargarReservas(); // ← actualiza la lista
    } catch (error) {
      toast.error("No se pudo cancelar la reserva");
      console.error("Error al cancelar la reserva:", error);
    }
  };

  // const completarReserva = async (id) => {
  //   try {
  //     await axios.patch(
  //       `http://localhost:8000/api/reservas/${id}/completar`,
  //       {},
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     toast.success("Reserva completada");
  //     cargarReservas(); // ← actualiza la lista
  //   } catch (error) {
  //     toast.error("No se pudo completar la reserva");
  //     console.error("Error al completar la reserva:", error);
  //   }
  // };

  const cargarReservas = async () => {
    try {
      const res = await axios.get(`${server}/api/reservas/mis-reservas`, {
        withCredentials: true,
      });
      setReservas(res.data);
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="absolute top-6 left-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-800 dark:text-white rounded-full shadow-md transition duration-300"
          >
            <ArrowLeftCircle size={22} />
            <span className="font-medium"></span>
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Mis reservas
        </h1>

        <div className="fixed bottom-6 right-6 z-50">
          <button
            className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-xl hover:bg-emerald-700 transition duration-300 flex items-center gap-2"
            onClick={() => navigate("/mis-reservas")}
          >
            <Plus size={20} />
            {/* <CalendarCheck size={20} /> */}
            Nueva reserva
          </button>
        </div>

        {reservas.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No tenés reservas registradas.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reservas.map((reserva) => (
              <Card
                key={reserva._id}
                className="bg-white dark:bg-gray-800 shadow-md"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800 dark:text-white">
                    {reserva.servicio?.nombre}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-gray-700 dark:text-gray-300">
                  <p>
                    <strong>Barbero:</strong> {reserva.barbero?.nombre}
                  </p>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(reserva.fechaHora).toLocaleString()}
                  </p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    <span
                      className={
                        reserva.estado === "pendiente"
                          ? "text-yellow-600"
                          : reserva.estado === "finalizado"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    ></span>{" "}
                    {reserva.estado}
                  </p>
                  {reserva.estado === "pendiente" &&
                    new Date(reserva.fechaHora) > new Date() && (
                      <button
                        onClick={() => cancelarReserva(reserva._id)}
                        className="mt-3 px-4 py-2 text-sm font-semibold text-red-600 border border-red-400 rounded-xl hover:bg-red-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-300"
                      >
                        Cancelar reserva
                      </button>
                    )}
                  {/* {reserva.estado === "pendiente" &&
                    new Date(reserva.fechaHora) <= new Date() && (
                      <button
                        onClick={() => completarReserva(reserva._id)}
                        className="mt-3 ml-2 px-4 py-2 text-sm font-semibold text-green-600 border border-green-400 rounded-xl hover:bg-green-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-300"
                      >
                        Turno atendido
                      </button>
                    )} */}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisReservas;
