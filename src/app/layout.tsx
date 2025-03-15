import { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./providers";
import BootstrapProvider from "./bootstrap-provider";
import { ThemeProvider } from "@/context/ThemeContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bill Generator",
  description: "Generate various types of bills for personal use",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <ThemeProvider>
            <BootstrapProvider>{children}</BootstrapProvider>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
