import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

const conectarDB = async () => {
  try {
    await mongoose.connect(mongoURI, {});
    console.log("Base de datos conectada");
  } catch (error) {
    console.log("Error al conectar a la base de datos", error);
    process.exit(1); // Terminar el proceso si hay un error de conexión
  }
};

const corsOptions = {
  origin: "http://localhost:5173", // Reemplaza con la URL de tu aplicación React
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

export { conectarDB, corsOptions };
