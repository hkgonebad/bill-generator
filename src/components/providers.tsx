"use client";

import React from "react";
import { SSRProvider } from "react-bootstrap";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/context/ThemeContext";
import NavbarApp from "./NavbarApp";
import Footer from "./Footer";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

// Bootstrap JS is required for interactive components
export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize Bootstrap JS on the client side

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
