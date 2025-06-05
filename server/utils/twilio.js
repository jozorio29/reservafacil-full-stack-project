import twilio from "twilio";
import cron from "node-cron";
import Reservation from "../models/reservation.model.js";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

const enviarWhatsapp = async (numeroDestino, mensaje) => {
  try {
    const message = await client.messages.create({
      body: mensaje,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `whatsapp:${numeroDestino}`,
    });
    console.log("Mensaje enviado:", message.sid);
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
  }
};

cron.schedule("* * * * *", async () => {
  const ahora = new Date();
  const en40Min = new Date(ahora.getTime() + 40 * 60 * 1000);

  const proximasReservas = await Reservation.find({
    fechaHora: {
      $gte: en40Min,
      $lte: new Date(en40Min.getTime() + 60 * 1000), // rango de 1 minuto
    },
  }).populate("cliente");

  // const hoy = new Date();
  // const inicioDelDia = new Date(
  //   hoy.getFullYear(),
  //   hoy.getMonth(),
  //   hoy.getDate() + 1,
  //   0,
  //   0,
  //   0
  // ); // mañana a las 00:00
  // const finDelDia = new Date(
  //   hoy.getFullYear(),
  //   hoy.getMonth(),
  //   hoy.getDate() + 1,
  //   23,
  //   59,
  //   59
  // ); // mañana a las 23:59

  // const proximasReservas = await Reservation.find({
  //   fechaHora: {
  //     $gte: inicioDelDia,
  //     $lte: finDelDia,
  //   },
  // }).populate("cliente");

  for (const reserva of proximasReservas) {
    const telefono = reserva?.cliente?.telefono;

    if (!telefono) {
      console.warn(
        "Cliente sin teléfono:",
        reserva.cliente?.nombre || "Desconocido"
      );
      continue; // saltar esta reserva
    }

    const fecha = new Date(reserva.fechaHora);
    const fechaFormateada = fecha.toLocaleDateString("es-ES");
    const horaFormateada = fecha.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const mensaje = `¡Hola ${reserva.cliente.nombre}! Le recordamos su cita para hoy ${fechaFormateada} a las ${horaFormateada}. ¡Nos vemos!`;
    await enviarWhatsapp(telefono, mensaje);
    console.log("☎️ Enviando mensaje a:", reserva.cliente?.telefono);
  }
});

export { enviarWhatsapp };
