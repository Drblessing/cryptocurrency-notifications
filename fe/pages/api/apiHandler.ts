import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

type ResponseData = {
  message: string;
};

// Master apiHandler for all api calls.
// Needed due to limitations of Cloudflare.
// Switch between api calls based on the path.
export default async function handler(req: NextRequest): Promise<Response> {
  // In function data
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
  const sampleGainers: string = `name,price,change,href_id,api_id,symbol,contract_address
  Swarm Markets,$0.175009,71.8%,swarm-markets,swarm-markets,smt,0xb17548c7b510427baac4e267bea62e800b247173
  Pendle,$0.535991,35.7%,pendle,pendle,pendle,0x808507121b80c02388fad14726482e061b8da827
  Don't Buy Inu,$0.009880585594,31.9%,don-t-buy-inu,don-t-buy-inu,dbi,0x2de509bf0014ddf697b220be628213034d320ece
  Ultra,$0.297450,26.7%,ultra,ultra,uos,0xd13c7342e1ef687c5ad21b27c2b65d772cab5c8c
  BORA,$0.225542,24.4%,bora,bora,bora,0x26fb86579e371c7aedc461b2ddef0a8628c93d3b
  Utrust,$0.125988,22.9%,utrust,utrust,utk,0xdc9ac3c20d1ed0b540df9b1fedc10039df13f99c
  LUKSO,$9.87,21.9%,lukso-token,lukso-token,lyxe,0xa8b919680258d369114910511cc87595aec0be6d
  PlayDapp,$0.274154,21.4%,playdapp,playdapp,pla,0x3a4f40631a4f906c2bad353ed06de7a5d3fcb430
  Manifold Finance,$34.71,18.4%,manifold-finance,manifold-finance,fold,0xd084944d3c05cd115c09d072b9f44ba3e0e45921
  Coin98,$0.309588,18.2%,coin98,coin98,c98,0xae12c5930881c53715b369cec7606b70d8eb229f
  Gamma Strategies,$0.390115,17.6%,gamma-strategies,gamma-strategies,gamma,0x6bea7cfef803d1e3d5f7c0103f7ded065644e197
  Radio Caca,$0.000228037850,17.4%,radio-caca,radio-caca,raca,0x12bb890508c125661e03b09ec06e404bc9289040
  BABB,$0.000690300553,17.3%,babb,babb,bax,0xf920e4f3fbef5b3ad0a25017514b769bdc4ac135
  Stader,$1.55,15.3%,stader,stader,sd,0x30d20208d987713f46dfd34ef128bb16c404d10f
  Hashflow,$0.672432,15.0%,hashflow,hashflow,hft,0xb3999f658c0391d94a37f7ff328f3fec942bcadc
  Altered State Machine,$0.048276595727,14.8%,altered-state-token,altered-state-token,asto,0x823556202e86763853b40e9cde725f412e294689
  Velas,$0.022918205660,13.3%,velas,velas,vlx,0x8c543aed163909142695f2d2acd0d55791a9edb9
  Hourglass,$0.316995,12.9%,hourglass,hourglass,wait,0x2559813bbb508c4c79e9ccce4703bcb1f149edd7
  Shib Original Vision,$0.000000326461,12.8%,shib-original-vision,shib-original-vision,sov,0x2c5bc2ba3614fd27fcc7022ea71d9172e2632c16
  MedCareCoin,$0.682029,274.7%,medcarecoin,medcarecoin,mdcy,0xfeead860ffa43e5660ca62ea5953a74f695c1d5b
  Anchor Neural World,$0.000603345207,177.2%,anchor-neural-world-token,anchor-neural-world-token,anw,0x7dbdd9dafdc4c1c03d67925a4f85daa398af32b0
  Origin Sport,$0.000180071430,100.0%,origin-sport,origin-sport,ors,0xeb9a4b185816c354db92db09cc3b50be60b901b6
  ZENEX,$0.494454,92.7%,zenex,zenex,znx,0x9471d30d78a3c9f076ce206d14867a8d8be1efde
  Pantomime,$0.048597993833,72.5%,pantomime,pantomime,panto,0x54b8d105aa09342fad6b352d41a0bad3e1a9aa9d
  Unipilot,$3.94,69.1%,unipilot,unipilot,pilot,0x37c997b35c619c21323f3518b9357914e8b99525
  Pledgecamp,$0.000039177100,68.5%,pledgecamp,pledgecamp,plg,0x85ca6710d0f1d511d130f6935edda88acbd921bd
  Punk Vault (NFTX),"$111,741",59.8%,punk-vault-nftx,punk-vault-nftx,punk,0x269616d549d7e8eaa82dfb17028d0b212d11232a
  Sheikh Inu,$0.000000423293,52.2%,sheikh-inu,sheikh-inu,shinu,0x0d229c3ff2d76e4b88ca4f9d3d3353f4545ec53f
  Theopetra,$1.35,51.1%,theopetra,theopetra,theo,0xfac0403a24229d7e2edd994d50f5940624cbeac2
  Etherland,$0.030381594024,49.3%,etherland,etherland,eland,0x33e07f5055173cf8febede8b21b12d1e2b523205
  0x0.ai: AI Smart Contract,$0.010247636489,47.7%,0x0-ai-ai-smart-contract,0x0-ai-ai-smart-contract,0x0,0x5a3e6a77ba2f983ec0d371ea3b475f8bc0811ad5
  Melecoin,$0.017709490586,47.5%,melecoin,melecoin,mlc,0x14449de7937fe1c1207006e92f89dee17bbe418a
  Zeus AI,$0.043252181087,43.6%,zeus-ai,zeus-ai,zeus,0x6ef460eb3563cfcc73f8147b0a77daffee71f867
  Zam.io,$0.012592664350,41.7%,zam-io,zam-io,zam,0xd373576a9e738f37dc6882328358ff69c4caf4c6
  PWRCASH,$0.005477098120,41.1%,pwrcash,pwrcash,pwrc,0x6aa40d02115090d40dc33c7c5f3cf05112fa4f83
  Friends With Benefits Pro,$9.38,40.8%,friends-with-benefits-pro,friends-with-benefits-pro,fwb,0x35bd01fc9d6d5d81ca9e055db88dc49aa2c699a8
  Image Generation AI,$0.013866059238,17.4%,image-generation-ai,imgnai,imgnai,0xa735a3af76cc30791c61c10d585833829d36cbe0
  FloraChain,$2.42,227.2%,florachain,florachain-yield-token,fyt,0x77f2be773ca0887ba2b3ef8344c8cf13c98d8ca7
  RocketX exchange,$0.089471458985,42.2%,rocketx-exchange,rocketx,rvf,0xdc8af07a7861bedd104b8093ae3e9376fc8596d2`;

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
      console.log('1.');
      console.log(
        !name,
        !price,
        !percent_change,
        !href_id,
        !api_id,
        !symbol,
        !contract_address,
        contract_address.length !== 42,
        contract_address.startsWith('0x')
      );
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
    const lines = gainers.split('\n');
    if (lines.length < 1) {
      throw new Error('No lines in gainers');
    }

    console.log(`Parsing ${lines.length - 1} tokens`);

    const headers = lines[0].split(',');
    const tokens = lines
      .slice(1)
      .map((line) => line.trim().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));

    const gainerTokens: GainerToken[] = tokens.map((token) => {
      if (!isValidToken(token)) {
        throw new Error(`Invalid token: ${token}`);
      }

      return parseToken(token);
    });
    return gainerTokens;
  };

  // Get full url of req
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  const method = searchParams.get('method');

  // Switch between api calls based on the method
  switch (method) {
    case 'getGainers':
      // Local
      if (process.env.NODE_ENV === 'development') {
        const res = sampleGainers;
        const gainers = parseGainers(res);
        return new Response(JSON.stringify(gainers), { status: 200 });
      }

      return new Response(
        JSON.stringify({
          message: 'Hello from the methods API',
        }),
        { status: 200 }
      );
    // default
    default:
      return new Response(
        JSON.stringify({
          message: 'Hello from the API',
        }),
        { status: 200 }
      );
  }
}
