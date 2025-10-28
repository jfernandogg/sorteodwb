
import { type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // This endpoint is no longer used since payment functionality has been removed
  return new Response('Esta funcionalidad ya no está disponible', { status: 410 });
}
