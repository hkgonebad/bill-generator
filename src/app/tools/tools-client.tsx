"use client";

import Link from "next/link";
import { Container, Row, Col, Card } from "react-bootstrap";
import Header from "@/components/Header";
import { Clock, QrCode, Wrench, LayoutGrid } from "lucide-react";

export default function ToolsClient() {
  return (
    <>
      <Header title="Tools" subtitle="Access various utility tools for your convenience" icon={<LayoutGrid size={24} />} showButton={false} />
      <Container className="mb-5">
        <Row className="justify-content-center">
          <Col lg={4} md={6} className="mb-4">
            <Link href="/weekly-time-calculator" className="text-decoration-none">
              <Card className="h-100 tool-card">
                <Card.Body className="text-center py-4">
                  <div className="icon-wrapper mb-3 text-primary">
                    <Clock size={36} />
                  </div>
                  <Card.Title>Weekly Time Calculator</Card.Title>
                  <Card.Text>Track and calculate your weekly working hours with a simple and intuitive interface.</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          <Col lg={4} md={6} className="mb-4">
            <Link href="/qrcode-generator" className="text-decoration-none">
              <Card className="h-100 tool-card">
                <Card.Body className="text-center py-4">
                  <div className="icon-wrapper mb-3 text-primary">
                    <QrCode size={36} />
                  </div>
                  <Card.Title>QR Code Generator</Card.Title>
                  <Card.Text>Generate QR codes for URLs, text, or any data you need to share quickly.</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          <Col lg={4} md={6} className="mb-4">
            <Card className="h-100 tool-card">
              <Card.Body className="text-center py-4">
                <div className="position-absolute end-0 top-0 m-2">
                  <span className="badge bg-info">Coming Soon</span>
                </div>
                <div className="icon-wrapper mb-3 text-muted">
                  <Wrench size={36} />
                </div>
                <Card.Title className="text-muted">More Tools</Card.Title>
                <Card.Text className="text-muted">We&apos;re working on adding more useful tools to help simplify your day-to-day tasks.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center mt-4">
          <p>
            Have a suggestion for a new tool?{" "}
            <Link href="#suggestion-form" className="text-decoration-none">
              Let us know!
            </Link>
          </p>
        </div>
      </Container>
    </>
  );
}
