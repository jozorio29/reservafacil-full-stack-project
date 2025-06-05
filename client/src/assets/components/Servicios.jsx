import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Servicios = () => {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/servicios",
          {
            withCredentials: true,
          }
        );
        setServicios(response.data);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };

    fetchServicios();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Servicios disponibles
      </h1>
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
