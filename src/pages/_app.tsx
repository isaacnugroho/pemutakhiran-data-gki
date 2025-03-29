import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize Materialize JavaScript on the client side
    if (typeof window !== 'undefined') {
      // This is needed because we're importing Materialize JS as a script tag
      // and not as an npm package
      const materialize = (window as any).M;
      if (materialize && materialize.AutoInit) {
        materialize.AutoInit();
      }
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
