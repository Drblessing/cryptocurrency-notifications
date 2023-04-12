// @ts-nocheck
import { useMemo, useEffect, useState } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import makeData from '@/components/makeData';
import { MdOpenInNew } from 'react-icons/md';
import {
  MdFirstPage,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdLastPage,
} from 'react-icons/md';

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  HStack,
  Text,
  Icon,
  Stack,
} from '@chakra-ui/react';

import { AiFillCaretUp, AiFillCaretDown } from 'react-icons/ai';

import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

import { Button, Flex, Input, Select, Spacer } from '@chakra-ui/react';

export default function TableFunc({ columns, data }: any) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  }: any = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    } as any,
    useSortBy,
    usePagination
  );

  // Render the UI for your table
  return (
    <TableContainer maxW={'3xl'}>
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <Icon as={AiFillCaretDown} />
                    ) : (
                      <Icon as={AiFillCaretUp} />
                    )
                  ) : (
                    ''
                  )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Flex alignItems='center' mt='4'>
        <Button
          disabled={!canPreviousPage}
          onClick={() => gotoPage(0)}
          variant='ghost'
          size='sm'
          ml='2'
          mr='1'
          colorScheme='gray'
        >
          <MdFirstPage />
        </Button>
        <Button
          disabled={!canPreviousPage}
          onClick={() => previousPage()}
          variant='ghost'
          size='sm'
          mr='1'
          colorScheme='gray'
        >
          <MdKeyboardArrowLeft />
        </Button>
        <Button
          disabled={!canNextPage}
          onClick={() => nextPage()}
          variant='ghost'
          size='sm'
          mr='1'
          colorScheme='gray'
        >
          <MdKeyboardArrowRight />
        </Button>
        <Button
          disabled={!canNextPage}
          onClick={() => gotoPage(pageCount - 1)}
          variant='ghost'
          size='sm'
          mr='1'
          colorScheme='gray'
        >
          <MdLastPage />
        </Button>
        <Text>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </Text>
        <Spacer />
        <Flex alignItems='center'>
          <Text>Go to page:</Text>
          <Input
            type='number'
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            ml='2'
            mr='1'
            w='100px'
          />
          <Select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            size='sm'
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>
      </Flex>
    </TableContainer>
  );
}
