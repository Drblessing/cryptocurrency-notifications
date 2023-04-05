import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function onRequest(context: any): Promise<any> {
  const obj = await context.env.CRYPTO_NOTIFICATIONS.get('gainers.csv');
  if (obj === null) {
    return new Response('Not found', { status: 404 });
  }
  return new Response(obj.body);
}
