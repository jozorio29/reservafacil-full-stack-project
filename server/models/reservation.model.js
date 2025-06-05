import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    barbero: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    servicio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    fechaHora: {
      type: Date,
      required: true,
    },
    estado: {
      type: String,
      enum: ["pendiente", "confirmada", "cancelada", "finalizado"],
      default: "pendiente",
    },
    vistoPorBarbero: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Reservation", reservationSchema);
