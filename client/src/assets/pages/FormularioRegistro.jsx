import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { server } from "@/constants/config";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const FormularioRegistro = () => {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // Accedemos a la función login desde el contexto

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!nombre || !correo || !telefono || !password) {
      return toast.error("Todos los campos son obligatorios");
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${server}/api/auth/registro`,
        {
          nombre,
          correo,
          telefono,
          password,
        },
        {
          withCredentials: true,
        }
      );
      const { usuario } = response.data;
      login(usuario);
      toast.success("Registro exitoso");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al registrar:", error);
      toast.error("Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmitForm}>
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre completo</Label>
        <Input
          id="nombre"
          type="text"
          placeholder="nombre completo"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="correo">Correo electrónico</Label>
        <Input
          id="correo"
          type="email"
          placeholder="ejemplo@correo.com"
          required
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <Input
          id="telefono"
          type="tel"
          placeholder=""
          required
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
          >
            {showPassword ? (
              <VisibilityOff fontSize="small" />
            ) : (
              <Visibility fontSize="small" />
            )}
          </button>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full">
          Registrarse
        </Button>
      </div>

      <div className="mt-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
            o continuá con
          </span>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
        >
          <FcGoogle size={20} />
          <span>Continuar con Google</span>
        </Button>
      </div>
    </form>
  );
};

export default FormularioRegistro;
