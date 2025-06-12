export const PRECIO_POR_TICKET = parseInt(process.env.NEXT_PUBLIC_PRECIO_POR_TICKET || "10", 10);
export const PAYMENT_PHP_ENDPOINT_BASE_URL = process.env.NEXT_PUBLIC_PAYMENT_PHP_ENDPOINT_BASE_URL || "/api/crearLinkDePago"; // Placeholder ahora como ruta relativa
