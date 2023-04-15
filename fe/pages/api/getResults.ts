import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

// Fix process type, declare it as any type
declare const process: any;

export default async function onRequest(context: any): Promise<any> {
  const headers = {
    // 'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  if (process.env.NODE_ENV === 'development') {
    return new Response('hellow world', { status: 200, headers });
  }

  try {
    const obj = await process.env.CRYPTO_NOTIFICATIONS.get('results.csv');
    if (obj === null) {
      return new Response('Not found', { status: 404 });
    }

    const text = await obj.text();

    return new Response(text, { status: 200, headers });
  } catch (e: any) {
    return new Response(e.message);
  }
}
