import { Metadata } from "next";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard - Bill Generator",
  description: "Manage your bills and account settings",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
