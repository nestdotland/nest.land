import { Text, Heading } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import { Header } from '@nestdotland/ui';

function Layout() {
  return (
    <>
      <NextSeo title="Coming Soon™" />
      <Header alignItems="center">
        <Heading as="h1" size="xl" color="primary">
          Nest
        </Heading>
        <Text as="h2" fontSize="2xl" py="8">
          An{' '}
          <Text as="span" fontWeight="bold">
            immutable
          </Text>{' '}
          module registry for Deno.
        </Text>
        <Text>Coming Soon™</Text>
      </Header>
    </>
  );
}

export default Layout;
