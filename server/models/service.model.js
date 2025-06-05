import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    precio: {
      type: Number,
      required: true,
      min: 0, // Asegura que el precio no sea negativos
    },
    duracion: {
      type: Number,
      required: true,
    },
    descripcion: {
      type: String,
      default: "",
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Service", serviceSchema);
