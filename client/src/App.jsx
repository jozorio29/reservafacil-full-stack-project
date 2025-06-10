import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
// import { RutaProtegida } from "./assets/components/auth/RutaProtegida";
import NuevaReserva from "./assets/components/NuevaReserva";
import PanelBarbero from "./assets/components/PanelBarbero";
import Servicios from "./assets/components/Servicios";
import Barberos from "./assets/pages/Barberos";
import Dashboard from "./assets/pages/Dashboard";
import Login from "./assets/pages/Login";
import MisReservas from "./assets/components/MisReservas";

function App({ cargarReservas }) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* <Route element={<RutaProtegida />}>  */}
          <Route path="/barberos" element={<Barberos />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route
            path="/mis-reservas"
            element={<NuevaReserva cargarReservas={cargarReservas} />}
          />
          <Route path="/nueva-reserva" element={<MisReservas />} />
          <Route path="/panel-barbero" element={<PanelBarbero />} />
        {/* </Route> */}
      </Routes>

      <Toaster position="bottom-center" reverseOrder={false} />
    </Router>
  );
}

export default App;
