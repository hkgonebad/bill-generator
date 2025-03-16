import React from "react";
import type { Metadata } from "next";
import { Providers } from "../components/providers";
import "../styles/main.scss";

export const metadata: Metadata = {
  title: "Bill Generator",
  description: "Generate professional bills and receipts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
