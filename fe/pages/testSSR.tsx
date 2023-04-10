import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import DataTable from '@/components/DataTable';
import getBaseURL from '@/components/getBaseURL';

export default function TestSSR() {
  const [gainerTokens, setGainerToken] = useState<GainerToken[]>();

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

  const columnHelper = createColumnHelper<GainerToken>();

  const columns = [
    columnHelper.accessor('name', {
      cell: (info) => info.getValue(),
      header: 'Name',
    }),
    columnHelper.accessor('price', {
      cell: (info) => info.getValue(),
      header: 'Price ($)',
    }),
    columnHelper.accessor('percent_change', {
      cell: (info) => info.getValue(),
      header: 'Percent Change (%)',
    }),
    columnHelper.accessor('api_id', {
      cell: (info) => info.getValue(),
      header: 'API ID',
    }),
    columnHelper.accessor('symbol', {
      cell: (info) => info.getValue(),
      header: 'Symbol',
    }),
    columnHelper.accessor('contract_address', {
      cell: (info) => info.getValue(),
      header: 'Contract Address',
    }),
  ];

  // Fetch Data here until cloudflare pages supports NextJS
  useEffect(() => {
    // Define async function to fetch data
    async function fetchData() {
      const res = await fetch(
        `${getBaseURL()}/api/apiHandler?method=getGainers`
      );
      // Raise for error

      const data = await res.json();
      setGainerToken(data);
    }

    // Call function
    fetchData();
  }, []);

  return (
    <div>
      {!gainerTokens && <div>Loading...</div>}
      {gainerTokens && (
        <DataTable<GainerToken> columns={columns} data={gainerTokens} />
      )}
    </div>
  );
}
