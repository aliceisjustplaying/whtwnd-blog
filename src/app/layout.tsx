import type { Metadata } from "next";
import NextPlausible from "next-plausible";
import { Inter, Libre_Baskerville } from "next/font/google";
import localFont from "next/font/local";
import { cx } from "#/lib/cx";
import "./globals.css";

import { CLOUDFLARE_BEACON_TOKEN, DESCRIPTION, HOSTNAME } from "#/lib/config";
import Script from "next/script";

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const serif = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: "400",
  style: "normal",
});

const mono = localFont({
  src: "./fonts/CascadiaCodeNF.woff2",
  variable: "--font-cascadia-code",
  weight: "400",
});

export const metadata: Metadata = {
  title: HOSTNAME,
  description: DESCRIPTION,
  alternates: {
    canonical: `https://${HOSTNAME}`,
    types: {
      "application/rss+xml": `https://${HOSTNAME}/rss`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <NextPlausible
          domain={HOSTNAME}
          customDomain={`https://plausible.${HOSTNAME}`}
          trackOutboundLinks
          selfHosted
        />
      </head>
      <body
        className={cx(
          sans.variable,
          serif.variable,
          mono.variable,
          "font-sans antialiased",
        )}
      >
        {children}
      </body>
      <Script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></Script>
      <Script
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon={`{"token": "${CLOUDFLARE_BEACON_TOKEN}"}`}
      ></Script>
    </html>
  );
}
