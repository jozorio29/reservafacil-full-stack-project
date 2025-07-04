import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { server } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../config/firebase";
import FormularioRegistro from "./FormularioRegistro";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const Login = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [vista, setVista] = useState("login"); // "login" o "registro"
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!correo.trim() || !password.trim()) {
      return setError("Por favor, ingresa tu correo y contraseña");
    }

    setIsLoading(true); // comienza cargando

    try {
      const response = await axios.post(
        "/api/auth/login",
        {
          correo,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("✅ Login exitoso:", response.data);
      const { usuario } = response.data;
      login(usuario);

      toast.success("Inicio de sesión exitoso");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      const mensaje =
        error.response?.data?.message || "Error de inicio de sesión";
      setError(mensaje);
    } finally {
      setIsLoading(false); // termina de cargar
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(); // 🔐 Token de Firebase

      // Enviar token al servidor
      const response = await axios.post(
        "/api/auth/google-login",
        { idToken },
        { withCredentials: true }
      );

      const { usuario } = response.data;
      login(usuario); // se guarda en context

      toast.success("Inicio de sesión exitoso");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      toast.error("Error al iniciar sesión con Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md border border-gray-200 dark:border-gray-700 p-6 shadow-xl bg-white dark:bg-gray-900">
        {/* Tabs: Inicia sesión / Regístrate */}
        <div className="flex justify-center border-b pb-2 mb-4">
          <button
            onClick={() => setVista("login")}
            className={`px-4 pb-1 font-semibold transition ${
              vista === "login"
                ? "text-black dark:text-white border-b-2 border-red-500"
                : "text-gray-400"
            }`}
          >
            Inicia sesión
          </button>
          <button
            onClick={() => setVista("registro")}
            className={`px-4 pb-1 font-semibold transition ${
              vista === "registro"
                ? "text-black dark:text-white border-b-2 border-red-500"
                : "text-gray-400"
            }`}
          >
            Regístrate
          </button>
        </div>

        {vista === "login" ? (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Iniciá sesión</CardTitle>
              <CardDescription>
                Ingresa tus datos para continuar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo electrónico</Label>
                  <Input
                    id="correo"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
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

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    Ingresar
                  </Button>
                </div>
              </form>

              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                    acceso rápido con
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
                  disabled={isLoading}
                >
                  <FcGoogle size={20} />
                  <span>Continuar con Google</span>
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent>
            <FormularioRegistro />
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Login;
