import { Metadata } from "next";
import QRCodeGeneratorClient from "./qrcode-generator-client";

export const metadata: Metadata = {
  title: "QR Code Generator - Bill Generator",
  description: "Generate QR codes for any URL or text",
};

export default function QRCodeGeneratorPage() {
  return <QRCodeGeneratorClient />;
}
