import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { server } from "@/constants/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { ArrowLeftCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Barberos = () => {
  const [barberos, setBarberos] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBarberos = async () => {
      try {
        const response = await axios.get(`${server}/api/usuarios/barberos`, {
          withCredentials: true,
        });
        setBarberos(response.data);
      } catch (error) {
        setError("No se pudieron cargar los barberos");
      }
    };
    fetchBarberos();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 relative">
      {/* Encabezado estilo app */}
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
          Nuestros Barberos
        </h1>
      </div>

      <Card>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {barberos.length === 0 ? (
            <p>No hay barberos disponibles en este momento.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {barberos.map((barbero) => (
                <Card key={barbero._id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{barbero.nombre}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{barbero.telefono}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Barberos;
