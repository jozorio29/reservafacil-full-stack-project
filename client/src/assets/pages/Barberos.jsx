import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { server } from "@/constants/config";
import axios from "axios";
import { useEffect, useState } from "react";

const Barberos = () => {
  const [barberos, setBarberos] = useState([]);
  const [error, setError] = useState("");

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
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Nuestros Barberos</CardTitle>
        </CardHeader>
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
