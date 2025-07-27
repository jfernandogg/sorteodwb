export const PRECIO_POR_TICKET = parseInt(process.env.NEXT_PUBLIC_PRECIO_POR_TICKET || "10", 10);
export const PAYMENT_PHP_ENDPOINT_BASE_URL = process.env.NEXT_PUBLIC_PAYMENT_PHP_ENDPOINT_BASE_URL || "/api/crearLinkDePago"; // Placeholder ahora como ruta relativa
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/sorteodb";
