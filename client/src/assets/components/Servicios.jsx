import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { server } from "@/constants/config";
import axios from "axios";
import { ArrowLeftCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Servicios = () => {
  const [servicios, setServicios] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        // const token = localStorage.getItem("token");
        const response = await axios.get("/api/servicios", {
          withCredentials: true,
        });
        setServicios(response.data);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };

    fetchServicios();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Encabezado fijo estilo app */}
      <div className="relative mb-8">
        {/* Botón Volver alineado a la izquierda */}
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-800 dark:text-white rounded-full shadow-md transition"
        >
          <ArrowLeftCircle size={22} />
          <span className="font-medium">Volver</span>
        </button>

        {/* Título centrado */}
        <h1 className="text-center text-3xl font-bold text-gray-800 dark:text-white">
          Servicios disponibles
        </h1>
      </div>

      {/* Lista de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicios.map((servicio) => (
          <Card key={servicio._id} className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 dark:text-white">
                {servicio.nombre}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Precio:</strong> {servicio.precioFormateado} Gs.
              </p>
              <p>
                <strong>Duración:</strong> {servicio.duracion} min
              </p>
              {servicio.descripcion && (
                <p>
                  <strong>Descripción:</strong> {servicio.descripcion}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Servicios;
