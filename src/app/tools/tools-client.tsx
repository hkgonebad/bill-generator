"use client";

import Link from "next/link";
import { Container, Row, Col, Card } from "react-bootstrap";
import NavbarComponent from "@/components/NavbarApp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faQrcode, faTools } from "@fortawesome/free-solid-svg-icons";

export default function ToolsClient() {
  return (
    <>
      <NavbarComponent />
      <Container className="mt-4 mb-5">
        <h1 className="text-center mb-4">Tools</h1>

        <Row className="justify-content-center">
          <Col lg={4} md={6} className="mb-4">
            <Link href="/weekly-time-calculator" className="text-decoration-none">
              <Card className="h-100 shadow-sm tool-card">
                <Card.Body className="text-center py-4">
                  <FontAwesomeIcon icon={faClock} size="3x" className="mb-3 text-primary" />
                  <Card.Title>Weekly Time Calculator</Card.Title>
                  <Card.Text>Track and calculate your weekly working hours with a simple and intuitive interface.</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          <Col lg={4} md={6} className="mb-4">
            <Link href="/qrcode-generator" className="text-decoration-none">
              <Card className="h-100 shadow-sm tool-card">
                <Card.Body className="text-center py-4">
                  <FontAwesomeIcon icon={faQrcode} size="3x" className="mb-3 text-primary" />
                  <Card.Title>QR Code Generator</Card.Title>
                  <Card.Text>Generate QR codes for URLs, text, or any data you need to share quickly.</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          <Col lg={4} md={6} className="mb-4">
            <Card className="h-100 shadow-sm tool-card">
              <Card.Body className="text-center py-4">
                <div className="position-absolute end-0 top-0 m-2">
                  <span className="badge bg-info">Coming Soon</span>
                </div>
                <FontAwesomeIcon icon={faTools} size="3x" className="mb-3 text-muted" />
                <Card.Title className="text-muted">More Tools</Card.Title>
                <Card.Text className="text-muted">We're working on adding more useful tools to help simplify your day-to-day tasks.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center mt-4">
          <p>
            Have a suggestion for a new tool? <Link href="/contact">Let us know!</Link>
          </p>
        </div>
      </Container>
    </>
  );
}
