import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

// Fix process type, declare it as any type
declare const process: any;

export default async function onRequest(context: any): Promise<any> {
  console.log(process.env.NODE_ENV);
  try {
    const obj = await process.env.CRYPTO_NOTIFICATIONS.get('gainers.csv');
    if (obj === null) {
      return new Response('Not found', { status: 404 });
    }
    return new Response(obj.body);
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }
}
