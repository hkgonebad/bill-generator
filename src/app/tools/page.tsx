import { Metadata } from "next";
import ToolsClient from "./tools-client";

export const metadata: Metadata = {
  title: "Tools - Bill Generator",
  description: "Access various utility tools for your convenience",
};

export default function ToolsPage() {
  return <ToolsClient />;
}
