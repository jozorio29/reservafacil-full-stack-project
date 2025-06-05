import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { ArrowLeftCircle, CalendarCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const NuevaReserva = ({ cargarReservas }) => {
  const [barberos, setBarberos] = useState([]);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [bloques, setBloques] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState("");
  const [servicios, setServicios] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barberosRes, serviciosRes] = await Promise.all([
          axios.get("http://localhost:8000/api/usuarios/barberos", {
            withCredentials: true,
          }),
          axios.get("http://localhost:8000/api/servicios", {
            withCredentials: true,
          }),
        ]);
        setBarberos(barberosRes.data);
        setServicios(serviciosRes.data);
      } catch (error) {
        toast.error("Error cargando datos iniciales");
      }
    };
    fetchData();
  }, []);

  const deshabilitarFechas = (date) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return date.getDay() === 0 || date < hoy;
  };

  const obtenerDisponibilidad = async () => {
    if (!barberoSeleccionado || !fechaSeleccionada) return;

    const fecha = fechaSeleccionada.toLocaleDateString("sv-SE");
    try {
      const res = await axios.get(
        `http://localhost:8000/api/barberos/${barberoSeleccionado}/disponibilidad?fecha=${fecha}`,
        { withCredentials: true }
      );
      setBloques(res.data.bloquesDisponibles);
    } catch (error) {
      toast.error("Error al obtener disponibilidad");
    }
  };

  const handleCrearReserva = async (bloque) => {
    if (!barberoSeleccionado || !servicioSeleccionado || !bloque) {
      return toast.error("Completa todos los campos");
    }

    try {
      await axios.post(
        "http://localhost:8000/api/reservas",
        {
          barbero: barberoSeleccionado,
          servicio: servicioSeleccionado,
          fechaHora: bloque,
        },
        { withCredentials: true }
      );
      toast.success("Reserva creada con éxito");
      if (cargarReservas) cargarReservas();
      navigate("/nueva-reserva");
    } catch (error) {
      toast.error("Error al crear reserva");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-tr from-gray-50 to-gray-100 to-blue-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-800 dark:text-white rounded-full shadow-md transition duration-300"
        >
          <ArrowLeftCircle size={22} />
          <span className="font-medium"></span>
        </button>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">
        Nueva reserva
      </h1>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-xl hover:bg-emerald-700 transition duration-300 flex items-center gap-2"
          onClick={() => navigate("/nueva-reserva")}
        >
          <CalendarCheck size={20} />
          Mis Reservas
        </button>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <Label>Selecciona un barbero</Label>
          <Select
            value={barberoSeleccionado}
            onValueChange={setBarberoSeleccionado}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="-- Seleccionar --" />
            </SelectTrigger>
            <SelectContent>
              {barberos.map((b) => (
                <SelectItem key={b._id} value={b._id}>
                  {b.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Selecciona un servicio</Label>
          <Select
            value={servicioSeleccionado}
            onValueChange={setServicioSeleccionado}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="-- Seleccionar --" />
            </SelectTrigger>
            <SelectContent>
              {servicios.map((s) => (
                <SelectItem key={s._id} value={s._id}>
                  {s.nombre} - {s.precioFormateado} Gs.
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Selecciona una fecha</Label>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={fechaSeleccionada}
              onChange={setFechaSeleccionada}
              shouldDisableDate={deshabilitarFechas}
              renderInput={(params) => (
                <TextField {...params} fullWidth className="mt-2" />
              )}
            />
          </LocalizationProvider>
        </div>

        <Button onClick={obtenerDisponibilidad} className="w-full mt-4">
          Ver disponibilidad
        </Button>

        {bloques.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-3 dark:text-white text-center">
              Horarios disponibles
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {bloques.map((bloque) => (
                <Card
                  key={bloque}
                  onClick={() => handleCrearReserva(bloque)}
                  className="cursor-pointer border transition-all text-center hover:bg-emerald-100 dark:hover:bg-emerald-800 hover:shadow-lg hover:scale-105"
                >
                  <CardContent className="py-4 text-lg font-medium text-gray-800 dark:text-white">
                    {new Date(bloque).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NuevaReserva;
