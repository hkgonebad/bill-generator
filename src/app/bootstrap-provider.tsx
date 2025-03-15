"use client";

import { useEffect } from "react";
import { SSRProvider } from "@react-aria/ssr";

export default function BootstrapProvider({ children }: { children: React.ReactNode }) {
  // Initialize Bootstrap JavaScript on the client side
  useEffect(() => {
    // Import Bootstrap JS only on the client side
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return <SSRProvider>{children}</SSRProvider>;
}
