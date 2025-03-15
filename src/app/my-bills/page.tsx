import { Metadata } from "next";
import BillsClient from "./bills-client";

export const metadata: Metadata = {
  title: "My Bills - Bill Generator",
  description: "View, manage, and organize your generated bills",
};

export default function MyBillsPage() {
  return <BillsClient />;
}
