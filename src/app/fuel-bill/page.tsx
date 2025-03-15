import { Metadata } from "next";
import FuelBillClient from "./fuel-bill-client";

export const metadata: Metadata = {
  title: "Fuel Bill Generator - Bill Generator",
  description: "Generate customized fuel bills for personal use",
};

export default function FuelBillPage() {
  return <FuelBillClient />;
}
