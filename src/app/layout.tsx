import { Geist, Geist_Mono } from "next/font/google";

import { FumaProvider } from "@/providers";

import type { ReactNode } from "react";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    // TODO: check if necessary for Fumadocs - docs install shows this in layout
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>
          <FumaProvider>{children}</FumaProvider>
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
