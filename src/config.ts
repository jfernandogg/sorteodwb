export const PRECIO_POR_TICKET = parseInt(
  process.env.NEXT_PUBLIC_PRECIO_POR_TICKET || "10",
  10,
);

export const PAYMENT_ENDPOINT_BASE_URL =
  process.env.NEXT_PUBLIC_PAYMENT_ENDPOINT_BASE_URL ||
  "/api/crearLinkDePago"; // Default to built-in API route
