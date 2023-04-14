import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

// Fix process type, declare it as any type
declare const process: any;

type ResponseData = {
  message: string;
};
export default async function onRequest(context: any): Promise<any> {
  interface DataProps {
    gainers: GainerToken[];
    results: string;
  }

  interface GainerToken {
    name: string;
    price: number;
    percent_change: number;
    href_id: string;
    api_id: string;
    symbol: string;
    contract_address: `0x${string}`;
  }

  const isValidToken = (token: string[]): boolean => {
    const [
      name,
      price,
      percent_change,
      href_id,
      api_id,
      symbol,
      contract_address,
    ] = token;

    if (
      !name ||
      !price ||
      !percent_change ||
      !href_id ||
      !api_id ||
      !symbol ||
      !contract_address ||
      contract_address.length !== 42 ||
      !contract_address.startsWith('0x')
    ) {
      return false;
    }

    let price_formatted = price
      .replace('%', '')
      .replace('$', '')
      .replace('"', '');
    let percent_change_formatted = percent_change
      .replace('%', '')
      .replace('$', '')
      .replace('"', '');

    if (
      isNaN(parseFloat(price_formatted)) ||
      isNaN(parseFloat(percent_change_formatted))
    ) {
      return false;
    }

    return true;
  };

  const parseToken = (token: string[]): GainerToken => {
    const [
      name,
      price,
      percent_change,
      href_id,
      api_id,
      symbol,
      contract_address,
    ] = token;

    const contract_address_formatted = contract_address as `0x${string}`;
    const price_formatted = price
      .replace('%', '')
      .replace('$', '')
      .replace('"', '')
      .replace(',', '');
    const percent_change_formatted = percent_change
      .replace('%', '')
      .replace('$', '')
      .replace('"', '')
      .replace(',', '');
    const percent_change_formatted_number = parseFloat(
      percent_change_formatted
    );
    const price_formatted_number = parseFloat(price_formatted);

    return {
      name,
      price: price_formatted_number,
      percent_change: percent_change_formatted_number,
      href_id,
      api_id,
      symbol,
      contract_address: contract_address_formatted,
    };
  };

  /**
   * Parses the gainers string into an array of GainerToken objects
   * @param gainers The string of the gainers from the
   * google cloud funciton. It comes in a zip file,
   * which is then unzipped into two csv files.
   * One of the files is the gainers, which is what
   * this function parses.
   * @returns An array of GainerToken objects
   */
  const parseGainers = (gainers: string): GainerToken[] => {
    console.log(gainers);
    const lines = gainers.split('\n');
    if (lines.length < 1) {
      throw new Error('No lines in gainers');
    }

    const headers = lines[0].split(',');
    console.log(headers);
    const tokens = lines
      .slice(1)
      .map((line) => line.trim().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));

    const gainerTokens: GainerToken[] = tokens.map((token) => {
      console.log(token);
      if (!isValidToken(token)) {
        throw new Error(`Invalid token: ${token}`);
      }

      return parseToken(token);
    });
    return gainerTokens;
  };
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const obj = await process.env.CRYPTO_NOTIFICATIONS.get('gainers.csv');
    if (obj === null) {
      return new Response('Not found', { status: 404 });
    }

    const text = await obj.text();
    // const gainers = parseGainers(text);

    return new Response(text, { status: 200, headers });
  } catch (e: any) {
    return new Response(e.message);
  }
}
