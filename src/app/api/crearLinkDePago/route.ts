import { NextRequest } from 'next/server';

const API_URL = 'https://integrations.api.bold.co/online/link/v1';

export async function GET(req: NextRequest) {
  const apiKey = process.env.BOLD_API_KEY;
  if (!apiKey) {
    return new Response('BOLD_API_KEY not configured', { status: 500 });
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
    console.error('Bold API error:', text);
    return new Response('Error al crear el link de pago', { status: 500 });
  }

  const data = await resp.json();
  const url = data.payload?.url;
  if (!url) {
    return new Response('Respuesta inválida de Bold', { status: 500 });
  }

  return Response.redirect(url, 302);
}
