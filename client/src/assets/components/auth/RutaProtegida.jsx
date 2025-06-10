import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { server } from "@/constants/config";

const RutaProtegida = () => {
  const [autenticado, setAutenticado] = useState(null);

  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula un retraso de 1 segundo

        const res = await axios.get(`${server}/api/dashboard/resumen`, {
          withCredentials: true,
        });
        console.log("✅ Autenticado:", res.data);
        setAutenticado(true);
      } catch (error) {
        console.error(
          "⛔ Error autenticación:",
          error.response?.status,
          error.response?.data
        );
        setAutenticado(false);
      }
    };
    verificarAutenticacion();
  }, []);

  if (autenticado === null) {
    return <div>Cargando...</div>;
  }

  return autenticado ? <Outlet /> : <Navigate to="/" />;
};

export { RutaProtegida };
