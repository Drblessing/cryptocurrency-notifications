import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import DataTable from '@/components/DataTable';

type UnitConversion = {
  fromUnit: string;
  toUnit: string;
  factor: number;
};

const data: UnitConversion[] = [
  {
    fromUnit: 'inches',
    toUnit: 'millimetres (mm)',
    factor: 25.4,
  },
  {
    fromUnit: 'feet',
    toUnit: 'centimetres (cm)',
    factor: 30.48,
  },
  {
    fromUnit: 'yards',
    toUnit: 'metres (m)',
    factor: 0.91444,
  },
];

const columnHelper = createColumnHelper<UnitConversion>();

const columns = [
  columnHelper.accessor('fromUnit', {
    cell: (info) => info.getValue(),
    header: 'To convert',
  }),
  columnHelper.accessor('toUnit', {
    cell: (info) => info.getValue(),
    header: 'Into',
  }),
  columnHelper.accessor('factor', {
    cell: (info) => info.getValue(),
    header: 'Multiply by',
    meta: {
      isNumeric: true,
    },
  }),
];

export default function testApp() {
  return <DataTable columns={columns} data={data} />;
}
