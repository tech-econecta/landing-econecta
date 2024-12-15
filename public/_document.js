import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="32x32" href="/favicon.ico"></link>
          {/* También puedes agregar otros tamaños de íconos si es necesario */}
          {/* <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" /> */}
          {/* <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
