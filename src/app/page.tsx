import { Metadata } from "next";
import HomePage from "./home-page";

export const metadata: Metadata = {
  title: "Bill Generator - Home",
  description: "Create digital copies of bills and receipts for personal use",
};

export default function Home() {
  return <HomePage />;
}
