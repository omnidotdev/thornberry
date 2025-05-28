import { Assistant } from "next/font/google";

import { FumaProvider } from "@/providers";

import type { PropsWithChildren } from "react";

import "./globals.css";

const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sans",
});

const RootLayout = ({ children }: PropsWithChildren) => (
  // TODO: check if necessary for Fumadocs - docs install shows this in layout
  <html lang="en" suppressHydrationWarning>
    <body className={`${assistant.variable} antialiased`}>
      <main>
        <FumaProvider>{children}</FumaProvider>
      </main>
    </body>
  </html>
);

export default RootLayout;
