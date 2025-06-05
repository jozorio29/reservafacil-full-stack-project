import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { server } from "@/constants/config";

const RutaProtegida = () => {
  const [autenticado, setAutenticado] = useState(null);

  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        await axios.get(`${server}/api/dashboard/resumen`, {
          withCredentials: true,
        });
        setAutenticado(true);
      } catch (error) {
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
