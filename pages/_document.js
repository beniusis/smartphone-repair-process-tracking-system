import { ColorModeScript } from "@chakra-ui/react";
import { Html, Head, Main, NextScript } from "next/document";
import theme from "@/lib/theme";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/xml+svg" href="icon.svg" />
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
