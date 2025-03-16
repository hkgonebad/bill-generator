"use client";

import React from "react";
import { SSRProvider } from "react-bootstrap";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import NavbarApp from "./NavbarApp";
import Footer from "./Footer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SSRProvider>
        <ThemeProvider>
          <div className="d-flex flex-column min-vh-100">
            <NavbarApp />
            <main className="flex-grow-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </SSRProvider>
    </SessionProvider>
  );
}
