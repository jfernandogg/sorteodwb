
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const monto = searchParams.get('monto');
  const descripcion = searchParams.get('descripcion');

  if (!monto || !descripcion) {
    return NextResponse.json({ error: 'Faltan los parámetros monto o descripción.' }, { status: 400 });
  }

  // En un escenario real, aquí llamarías a la API de Bold Payments
  // con tu BOLD_API_KEY para generar un link de pago real.
  // Este es un ejemplo de cómo podrías hacerlo:
  /*
  const boldApiKey = process.env.BOLD_API_KEY;
  if (!boldApiKey) {
    console.error('BOLD_API_KEY no está configurada.');
    return NextResponse.json({ error: 'Error de configuración del servidor.' }, { status: 500 });
  }

  try {
    const boldResponse = await fetch('https://api.bold.co/v2/payment_links', { // URL de ejemplo, verificar la correcta
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${boldApiKey}`,
      },
      body: JSON.stringify({
        amount_in_cents: parseInt(monto) * 100, // Bold generalmente espera el monto en centavos
        description: descripcion,
        currency: 'COP',
        // ... otros parámetros requeridos por Bold ...
      }),
    });

    if (!boldResponse.ok) {
      const errorData = await boldResponse.json();
      console.error('Error al crear link de pago con Bold:', errorData);
      return NextResponse.json({ error: 'No se pudo generar el link de pago.', details: errorData }, { status: boldResponse.status });
    }

    const paymentLinkData = await boldResponse.json();
    const paymentUrl = paymentLinkData.data?.url; // Ajustar según la estructura de la respuesta de Bold

    if (paymentUrl) {
      return NextResponse.redirect(paymentUrl);
    } else {
      console.error('La respuesta de Bold no contenía una URL de pago:', paymentLinkData);
      return NextResponse.json({ error: 'No se pudo obtener la URL de pago de Bold.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error al conectar con Bold Payments:', error);
    return NextResponse.json({ error: 'Error interno al procesar el pago.' }, { status: 500 });
  }
  */

  // Por ahora, redirigimos a una URL de demostración/simulada de Bold.
  // Deberás reemplazar esto con la lógica real de generación de enlace y redirección.
  const mockPaymentId = `MOCK_${Date.now()}`;
  const simulatedBoldPaymentUrl = `https://pagos.bold.co/checkout?order=${mockPaymentId}&amount=${monto}&description=${encodeURIComponent(descripcion)}&currency=COP`;
  
  console.log(`Simulando redirección a Bold: ${simulatedBoldPaymentUrl}`);
  
  return NextResponse.redirect(simulatedBoldPaymentUrl);
}
