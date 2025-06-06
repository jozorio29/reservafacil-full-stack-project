import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { conectarDB, corsOptions } from "./config/config.js";
import authRoutes from "./routes/auth.routes.js";
import barberoRoutes from "./routes/barbero.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import userRoutes from "./routes/user.routes.js";
import "./utils/twilio.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions,
});
const PORT = process.env.PORT || 8000;
const envMode = process.env.NODE_ENV || "development";

// Middleware
app.use(helmet()); // Seguridad
app.use(compression()); // Compresión de respuestas
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Rutas API
app.use("/api/auth", authRoutes); // rutas de autenticación
app.use("/api/servicios", serviceRoutes);
app.use("/api/reservas", reservationRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/barberos", barberoRoutes);

// Esto es necesario si estás usando ESModules (type: "module" en package.json)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir frontend compilado (por ejemplo si usás Vite o React build)
app.use(express.static(path.join(__dirname, "client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  socket.on("unirse-barbero", (barberoId) => {
    socket.join(barberoId);
  });
});

conectarDB();

httpServer.listen(PORT, () =>
  console.log(`Server is running on port ${PORT} in ${envMode} mode`)
);

export { io };
