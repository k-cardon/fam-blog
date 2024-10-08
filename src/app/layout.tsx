import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/app/_components/session-provider";
import NavMenu from "@/app/_components/nav-menu";
import { nunito } from '@/lib/fonts';

export const metadata: Metadata = {
  title: `Nodrac's`,
  description: `Cardon family recipe blog`,
  }

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession();

  return (
    <html lang="en" className={nunito.className}>
      <head>
      <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon-v2.png"
        />
        {/* <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" /> */}
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body
        className='dark:bg-slate-900 dark:text-slate-400'
      >
        <SessionProvider session={session}>
        <NavMenu />
        <div className="min-h-screen m-14">{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
