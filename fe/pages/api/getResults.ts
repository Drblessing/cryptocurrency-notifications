import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

// Fix process type, declare it as any type
declare const process: any;

export default async function onRequest(context: any): Promise<any> {
  interface gainerTrader {
    wallet: `0x${string}`;
    num_tokens: number;
    num_txns: number;
  }

  const sampleResults = `wallet,num_tokens,num_txns
 0x270acbaef5ba96ff00b14e11c125d86f4c5bb940,3,3
 0xb458a756eb54882fb9a80bfe0be41078f803ffa6,3,3
 0x9a4ca42bf43333406c9e3fe352afd684bd93f7ce,3,3
 0x31315bffeadb13e022a0a08f1ce23e49b924cd22,3,3
 0x02f5b237de51cf8783a2954d833e062c1157c6d5,3,3
 0x25950f980176941e146b8a4bf8cdf48b26314634,3,3
 0x90448341feba1032b59e86b9c4a31642367e23d3,3,3
 0xad993dfa62d4c2d6dbece1739792067c967a36c1,4,4
 0xdf1f6587aa741ff62cabb9bed8dad062713cf3ec,3,4
 0xb4f34d09124b8c9712957b76707b42510041ecbb,3,4
 0x759ec1b3326de6fd4ba316f65a6f689c4e4c3092,3,4
 0xf6174f219d468b420af8787a979b7b81bc69d136,3,4
 0xb69c2b724d774ba45295aa1bed29a976150218eb,3,4
 0x226800a70272e68987adc79f5fc339ee29154252,3,4
 0x8cee98d8a7b193df071f2ab53c3dce1f6a0594da,3,4
 0x2bfb4dfdefcc4a72f03b0a3464eb2eafa2633583,3,5
 0xe0a616c3659be29567e08819772e6905307adf21,3,5
 0xd83eb40979ca0dabe945e22629a72765dc9a39bd,3,5
 0x6559f73a121bb2e1ffeaccf0cd187a01ceb0047c,3,5
 0x8eb2283f696f2a130134d46e28d3528e19e16868,3,6
 0xb8690d75ae929d031aa62bf19b41539bae3a69b1,3,6
 0xee22294e77c04338dc5bed295bbc5fba0ce5f23e,3,6
 0x1d283807630ffb876a5d78b8e0788e491449f241,4,7
 0x52c85ece0389c089ac6420d78d08529aaf815558,3,7
 0x62d63efdfdc7804666725f4cc8cb45c1a41a0809,3,8
 0x5e8304b5600cccba6d6292c6687ac9ead0ec6288,4,9
 0x4f2753ead681f1b3ac6496f8a97b2eed63b19726,4,10
 0xd9408f29026e32852aff8c5c9c8ea834b44b4e1c,4,10
 0x00000000000124d994209fbb955e0217b5c2eca1,4,10
 0xa752eea12f7ecaa7674363255e5e7f0b083a515c,3,10
 0xac38e6ba918587efd3752a580ed8426dc7a57bdd,4,11
 0xac55316b400957eb9648d9d6f32cb8fe9aa7cfe6,3,11
 0x5828eff23f92e582ddf4fbbc2900e7448e45bd6c,3,11
 0x5bdf85216ec1e38d6458c870992a69e38e03f7ef,4,12
 0x7ecccabb5e4ff4537f70b0a5018e8c0cfd53fff4,3,15
 0x13307b8854a95946b54a904100afd0767a7a577b,4,17
 0xd7f6f541d4210550ca56f7b4c4a549efd4cafb49,7,20
 0xc24d30475eca133302192b502085a3cc124b0b9b,3,22
 0xee230dd7519bc5d0c9899e8704ffdc80560e8509,7,26
 0x65a8f07bd9a8598e1b5b6c0a88f4779dbc077675,5,52
 0xb758b6576221a7504a7211307092c23d3ee191c9,5,54
 0x382ffce2287252f930e1c8dc9328dac5bf282ba1,19,82`;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  const parseResults = (results: string): gainerTrader[] => {
    const resultsTrim = results.trim();
    const lines = resultsTrim.split('\n');
    if (lines.length < 2) {
      throw new Error('Invalid results');
    }

    const [header, ...rest] = lines;
    const headers = header.split(',');

    const gainerTraders: gainerTrader[] = rest.map((line) => {
      const lineTrim = line.trim();
      const [address, num_tokens, num_txns] = lineTrim.split(',');

      if (address.length !== 42 || address.slice(0, 2) !== '0x') {
        throw new Error(`Invalid address: ${address}`);
      }

      return {
        wallet: address as `0x${string}`,
        num_tokens: parseInt(num_tokens),
        num_txns: parseInt(num_txns),
      };
    });
    return gainerTraders;
  };

  if (process.env.NODE_ENV === 'development') {
    const gainerTraders = parseResults(sampleResults);

    return new Response(JSON.stringify(gainerTraders), {
      status: 200,
      headers,
    });
  }

  try {
    const obj = await process.env.CRYPTO_NOTIFICATIONS.get('results.csv');
    if (obj === null) {
      return new Response('Not found', { status: 404 });
    }

    const text = await obj.text();

    const gainerTraders = parseResults(text);

    return new Response(JSON.stringify(gainerTraders), {
      status: 200,
      headers,
    });
  } catch (e: any) {
    return new Response(e.message);
  }
}
