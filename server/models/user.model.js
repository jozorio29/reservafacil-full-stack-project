import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    telefono: {
      type: String,
      required: function () {
        return !this.google;
      },
      match: /^[+]?[0-9]{3,5}[ ]?[0-9]{5,8}$/,
    },
    password: {
      type: String,
      required: function () {
        return !this.google;
      },
      minlength: 6,
    },
    rol: {
      type: String,
      enum: ["cliente", "barbero", "admin"],
      default: "cliente",
    },
    google: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware para hashear contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // solo si fue modificada

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Contraseña hasheada correctamente"); // solo para depuración 👈

    next();
  } catch (error) {
    console.log("Error al hashear la contraseña", error); // útil si hay problemas 👈

    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.compararContraseña = async function (contraseñaIngresada) {
  return await bcrypt.compare(contraseñaIngresada, this.password);
};

export default mongoose.model("User", userSchema);
