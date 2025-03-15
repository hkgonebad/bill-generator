import { Metadata } from "next";
import RentReceiptClient from "./rent-receipt-client";

export const metadata: Metadata = {
  title: "Rent Receipt Generator - Bill Generator",
  description: "Generate customized rent receipts for personal use",
};

export default function RentReceiptPage() {
  return <RentReceiptClient />;
}
