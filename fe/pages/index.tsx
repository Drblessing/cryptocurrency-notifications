import Head from 'next/head';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Gainers from '@/components/Gainers';
import GainersTable from '@/components/GainersTable';

import { Container, Flex, Box } from '@chakra-ui/react';

export default function Home() {
  return (
    <div className='mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0'>
      <Flex direction='column' minH='100vh'>
        <Box as='header'>
          <Navbar />
        </Box>

        <Box as='main' flex='1'>
          <GainersTable />
        </Box>
        <Box as='footer'>
          <Footer />
        </Box>
      </Flex>
    </div>
  );
}
