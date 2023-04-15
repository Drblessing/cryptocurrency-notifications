import NextLink from 'next/link';
import { MdOpenInNew } from 'react-icons/md';
import { Link, Icon } from '@chakra-ui/react';

const ExternalLink = ({ href }: { href: string }) => {
  return (
    <Link as={NextLink} href={href} isExternal>
      <Icon as={MdOpenInNew} color='blue.500' verticalAlign={'middle'} />
    </Link>
  );
};

export default ExternalLink;
