import Head from "next/head";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/calendar.css";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <main className={inter.className}>
        <Head>
          <title>Išmaniųjų telefonų remonto proceso sekimo sistema</title>
        </Head>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </main>
    </SessionProvider>
  );
}
