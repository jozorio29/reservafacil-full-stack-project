import { createContext, useContext, useState } from "react";

const NotificacionContext = createContext();
const NotificacionProvider = ({ children }) => {
  const [cantidadNotificaciones, setCantidadNotificaciones] = useState(0);
  return (
    <NotificacionContext.Provider
      value={{ cantidadNotificaciones, setCantidadNotificaciones }}
    >
      {children}
    </NotificacionContext.Provider>
  );
};

export const useNotificaciones = () => useContext(NotificacionContext);
export { NotificacionProvider };
