import { Loader2 } from "lucide-react";

const Loader = ({ mensaje = "Cargando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center text-gray-600 dark:text-gray-300 animate-fade-in">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-lg font-medium">{mensaje}</p>
    </div>
  );
};

export default Loader;
