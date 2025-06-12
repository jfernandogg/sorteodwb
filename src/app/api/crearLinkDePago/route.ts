
import { type NextRequest } from 'next/server';
import { getEnv } from '@/lib/firebaseEnv';

const API_URL = 'https://integrations.api.bold.co/online/link/v1';

export async function GET(req: NextRequest) {
  const apiKey = getEnv('bold.api_key');

  // Log a portion of the API key to help with debugging
  if (apiKey && apiKey.length > 8) {
    console.log(`[Bold API] Using API Key starting with: ${apiKey.substring(0, 4)}... and ending with: ...${apiKey.substring(apiKey.length - 4)}`);
  } else if (apiKey) {
    console.log("[Bold API] Using API Key (too short to mask fully):", apiKey);
  } else {
    console.log("[Bold API] API Key is undefined or null after calling getEnv('bold.api_key').");
  }

  if (!apiKey) {
    console.error("[Bold API] Critical: bold.api_key was not found or is empty in environment variables.");
    return new Response('bold.api_key no configurado o vacío en el servidor', { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const montoParam = searchParams.get('monto');
  const descripcion = searchParams.get('descripcion');

  if (!montoParam || !descripcion) {
    return new Response('Parámetros requeridos: monto y descripcion', { status: 400 });
  }

  const monto = parseInt(montoParam, 10);
  if (isNaN(monto)) {
    return new Response('Monto inválido', { status: 400 });
  }

  const payload = {
    amount_type: 'CLOSE',
    amount: {
      currency: 'COP',
      total_amount: monto,
      tip_amount: 0,
    },
    description: descripcion,
  };

  try {
    console.log('[Bold API] Attempting to create payment link with payload:', JSON.stringify(payload));
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `x-api-key ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await resp.text(); // Get response text regardless of status

    if (!resp.ok) {
      console.error(`[Bold API] Error: Status ${resp.status}. Response: ${responseText}`);
      return new Response(`Error al crear el link de pago con Bold: ${responseText}`, { status: resp.status });
    }

    const data = JSON.parse(responseText); // Parse text to JSON
    const url = data.payload?.url;
    if (!url) {
      console.error('[Bold API] Respuesta inválida de Bold, no se encontró la URL:', data);
      return new Response('Respuesta inválida de Bold, no se encontró la URL de pago.', { status: 500 });
    }

    console.log('[Bold API] Payment link created successfully. Redirecting to:', url);
    return Response.redirect(url, 302);

  } catch (error) {
    console.error('[Bold API] Exception during request to Bold API:', error);
    // @ts-ignore
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(`Error interno del servidor al conectar con Bold: ${errorMessage}`, { status: 500 });
  }
}
