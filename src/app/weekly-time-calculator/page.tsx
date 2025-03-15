import { Metadata } from "next";
import WeeklyTimeCalculatorClient from "./weekly-time-calculator-client";

export const metadata: Metadata = {
  title: "Weekly Time Calculator - Bill Generator",
  description: "Calculate and track your weekly working hours",
};

export default function WeeklyTimeCalculatorPage() {
  return <WeeklyTimeCalculatorClient />;
}
