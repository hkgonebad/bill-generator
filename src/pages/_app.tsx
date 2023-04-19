import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/main.scss';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Bill Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
