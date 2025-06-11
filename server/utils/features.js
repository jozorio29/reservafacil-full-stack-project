const cookieOptions = {
  httpOnly: true,
  secure: true, //process.env.NODE_ENV === "production", // Solo en producción
  sameSite: "none", //process.env.NODE_ENV === "production" ? "None" : "Lax", // "None" porque tenemos frontend y backend en dominios distintos con HTTPS
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días //  Al no definir expires ni maxAge, la cookie se convierte en una cookie de sesión,
  domain: process.env.COOKIE_DOMAIN,
  path: "/",
};

export { cookieOptions };
