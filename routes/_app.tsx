// routes/_app.tsx
import { define } from "../utils.ts";
import { Partial } from "fresh/runtime";
import Navbar from "@/islands/Navbar.tsx";
import Footer from "@/components/Footer.tsx";

export default define.page(function App({ Component, url }) {
  return (
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* PRELOAD DE FUENTES: Soluciona el retraso de LCP y errores de TS */}
        <link
          rel="preload"
          href="/fonts/Gotham-Ultra.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Gotham-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Raleway.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="/styles.css" />
        <link f-permanent rel="icon" type="image/x-icon" href="/favicon.ico" />
        <title>BTOQ</title>
      </head>
      <body
        className="bg-Azul text-Blanco flex min-h-screen flex-col"
        f-client-nav
      >
        <Navbar url={url} />
        <main className="grow">
          <Partial name="main-content">
            <Component />
          </Partial>
        </main>
        <Footer />
      </body>
    </html>
  );
});
