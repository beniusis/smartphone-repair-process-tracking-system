import Head from "next/head";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider>
      <main className={inter.className}>
        <Head>
          <title>Išmaniųjų telefonų remonto proceso sekimo sistema</title>
        </Head>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
