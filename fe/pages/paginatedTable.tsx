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

  const data = useMemo(
    () => [
      {
        from: 'inches',
        to: 'millimetres (mm)',
        factor: 25.4,
      },
      {
        from: 'feet',
        to: 'centimetres (cm)',
        factor: 30.48,
      },
      {
        from: 'yards',
        to: 'metres (m)',
        factor: 0.91444,
      },
    ],
    []
  );

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

  const columns = useMemo(
    () =>
      [
        { Header: 'from', accessor: 'from', align: 'right' },
        {
          Header: 'To convert',
          accessor: 'to',
          align: 'right',
        },
        {
          Header: 'multiply by',
          accessor: 'factor',
          align: 'right',
        },
      ] as const,
    []
  );

  return (
    <>
      {!data && <div>loading...</div>}
      {data && gainerToken && (
        <ReactTable columns={gainerColumns} data={gainerToken} />
      )}
    </>
  );
}

export default App;
