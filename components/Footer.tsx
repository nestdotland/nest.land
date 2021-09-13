import { Flex, FlexProps, Text, useColorModeValue } from '@chakra-ui/react';
import Image from 'next/image';
import Vercel from '@/components/Vercel';

function Footer(props: FlexProps) {
  return (
    <Flex
      as="footer"
      align="center"
      justify="space-between"
      p="6"
      w="full"
      height="5rem"
      maxW="8xl"
      bg={useColorModeValue('white', 'gray.900')}
      {...props}
    >
      <Text fontFamily="mono">
        Made with
        <Text px="1ch" as="span" color={useColorModeValue('red.600', 'red.400')}>
          &amp;hearts;
        </Text>
        for Deno Community.
      </Text>
      <Flex
        as="a"
        align="center"
        href="https://vercel.com?utm_source=nest_land"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Vercel />
      </Flex>
    </Flex>
  );
}

export default Footer;
