
import { type NextRequest } from 'next/server';
import { getEnv } from '@/lib/firebaseEnv';

const API_URL = 'https://integrations.api.bold.co/online/link/v1';

export async function GET(req: NextRequest) {
  const apiKey = getEnv('bold.api_key');
  if (!apiKey) {
    return new Response('bold.api_key no configurado', { status: 500 });
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
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `x-api-key ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Bold API error:', resp.status, text);
      return new Response(`Error al crear el link de pago con Bold: ${text}`, { status: resp.status });
    }

    const data = await resp.json();
    const url = data.payload?.url;
    if (!url) {
      console.error('Respuesta inválida de Bold, no se encontró la URL:', data);
      return new Response('Respuesta inválida de Bold, no se encontró la URL de pago.', { status: 500 });
    }

    return Response.redirect(url, 302);

  } catch (error) {
    console.error('Error en la solicitud a Bold API:', error);
    return new Response('Error interno del servidor al conectar con Bold.', { status: 500 });
  }
}
