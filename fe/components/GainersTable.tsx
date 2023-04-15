// @ts-nocheck
import { useMemo, useEffect, useState } from 'react';
import ReactTable from '@/components/Table';
import getBaseURL from '@/components/getBaseURL';
import { HStack, Link, Icon, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { MdOpenInNew } from 'react-icons/md';

function App() {
  const [gainerToken, setGainerToken] = useState(null);

  useEffect(() => {
    // Define async function to fetch data
    async function fetchData() {
      const res = await fetch(`${getBaseURL()}/api/getBucket`);
      // Raise for error
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const data = await res.json();
      setGainerToken(data);
    }

    // Call function
    fetchData();
  }, []);

  const gainerColumns = useMemo(
    () =>
      [
        // Use href cell to create a link to the coin
        {
          Header: 'name',
          accessor: 'name',
          Cell: (row) => {
            row.row.original.href_id;
            return (
              <HStack>
                <Text>{row.value}</Text>
                <Link
                  as={NextLink}
                  href={`https://coingecko.com/en/coins/${row.row.original.href_id}`}
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
        { Header: 'symbol', accessor: 'symbol' },
        { Header: '24hr (%)', accessor: 'percent_change' },
        { Header: 'api id', accessor: 'api_id' },
        { Header: 'price ($)', accessor: 'price' },
      ] as const,
    []
  );

  return (
    <>
      {!gainerToken && <div>Loading...</div>}
      {gainerToken && <ReactTable columns={gainerColumns} data={gainerToken} />}
    </>
  );
}

export default App;
