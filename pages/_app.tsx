import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@nestdotland/ui';
import { DefaultSeo } from 'next-seo';
import Layout from '@/components/Layout';
import { seo } from '@/utils/config';
import '@fontsource/jetbrains-mono';
import '@fontsource/inter';

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <DefaultSeo {...seo} />
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}

export default App;
