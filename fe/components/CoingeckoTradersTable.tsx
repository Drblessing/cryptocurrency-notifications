import { useEffect, useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import ReactTable from '@/components/Table';
import getBaseURL from '@/components/getBaseURL';
import { HStack, Link, Icon, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { MdOpenInNew } from 'react-icons/md';

const GainersTradersTable = function () {
  interface gainerTrader {
    wallet: `0x${string}`;
    num_tokens: number;
    num_txns: number;
  }

  const [coingeckoTraders, setCoingeckoTraders] = useState<gainerTrader[]>();

  const columnHelper = createColumnHelper<gainerTrader>();

  const columns = useMemo(
    () =>
      [
        {
          Header: 'Wallet',
          accessor: 'wallet',
          Cell: (row: any) => {
            const abbreviatedWallet = `${row.value.slice(
              0,
              6
            )}...${row.value.slice(-4)}`;
            return (
              <HStack>
                <Text>{abbreviatedWallet}</Text>
                <Link
                  as={NextLink}
                  href={`https://etherscan.io/address/${row.value}#tokentxns`}
                  isExternal
                >
                  <Icon
                    as={MdOpenInNew}
                    color='blue.500'
                    verticalAlign={'middle'}
                  />
                </Link>
              </HStack>
            );
          },
        },
        { Header: 'Num Tokens', accessor: 'num_tokens' },
        { Header: 'Num Txns', accessor: 'num_txns' },
      ] as const,
    []
  );

  // Fetch Data here until cloudflare pages supports NextJS
  useEffect(() => {
    // Define async function to fetch data
    async function fetchData() {
      const res = await fetch(`${getBaseURL()}/api/getResults`);
      // Raise for error
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const data = await res.json();
      setCoingeckoTraders(data);
    }

    // Call function
    fetchData();
  }, []);

  return (
    <>
      {!coingeckoTraders && <div>Loading...</div>}
      {coingeckoTraders && (
        <ReactTable columns={columns} data={coingeckoTraders} />
      )}
    </>
  );
};

export default GainersTradersTable;
