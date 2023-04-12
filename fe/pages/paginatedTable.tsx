// @ts-nocheck
import { useMemo, useEffect, useState } from 'react';
import ReactTable from '@/components/Table';
import getBaseURL from '@/components/getBaseURL';

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

  console.log(gainerToken);
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
        { Header: 'name', accessor: 'name' },
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
