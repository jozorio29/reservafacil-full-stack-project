import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { server } from "@/constants/config";
import Loader from "../../pages/Loaders";

const RutaProtegida = () => {
  const [autenticado, setAutenticado] = useState(null);

  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const res = await axios.get("/api/dashboard/resumen", {
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
    return <Loader mensaje="Verificando autenticación" />;
  }

  return autenticado ? <Outlet /> : <Navigate to="/" />;
};

export { RutaProtegida };
