import { Container } from '@/components/Container';
import { Main } from '@/components/Main';
import Footer from '@/components/Footer';
// import Navbar from '@/components/Navbar';
import { Navbar } from '@nestdotland/ui';
import { navbar } from '@/utils/config';
import Head from 'next/head';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container minHeight="100vh">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar {...navbar} />
      <Main>{children}</Main>
      <Footer />
    </Container>
  );
}

export default Layout;
