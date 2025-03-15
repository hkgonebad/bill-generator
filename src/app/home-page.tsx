"use client";

import { useState } from "react";
import { Modal, Button, Container, Row, Col, Card } from "react-bootstrap";
import Link from "next/link";
import NavbarComponent from "../components/NavbarApp";
import { Receipt, Fuel, Home, Clock, QrCode, FileText, Shield, Info } from "lucide-react";

export default function HomePage() {
  const [showModal, setShowModal] = useState<string | null>(null);

  const handleClose = () => setShowModal(null);
  const handleShow = (modal: string) => {
    setShowModal(modal);
  };

  const features = [
    {
      icon: <Receipt size={24} />,
      title: "Rent Receipts",
      description: "Generate professional rent receipts with customizable templates",
      link: "/rent-receipt",
    },
    {
      icon: <Fuel size={24} />,
      title: "Fuel Bills",
      description: "Create detailed fuel bills with automatic calculations",
      link: "/fuel-bill",
    },
    {
      icon: <Clock size={24} />,
      title: "Time Calculator",
      description: "Track and calculate your weekly working hours",
      link: "/weekly-time-calculator",
    },
    {
      icon: <QrCode size={24} />,
      title: "QR Code Generator",
      description: "Generate QR codes for various purposes",
      link: "/qr-code-generator",
    },
  ];

  return (
    <>
      <NavbarComponent />

      <div className="hero-section py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3">Generate Bills & Receipts with Ease</h1>
              <p className="lead mb-4">Create professional bills, receipts, and other documents for personal record keeping or as proof of purchase.</p>
              <div className="d-flex gap-3">
                <Link href="/dashboard" passHref>
                  <Button variant="primary" size="lg">
                    Get Started
                  </Button>
                </Link>
                <Link href="/tools" passHref>
                  <Button variant="outline-secondary" size="lg">
                    Explore Tools
                  </Button>
                </Link>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image text-center">
                <img
                  src="/images/hero-image.svg"
                  alt="Bill Generator"
                  className="img-fluid"
                  style={{ maxHeight: "400px" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <section className="features-section py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Our Features</h2>
          <Row>
            {features.map((feature, index) => (
              <Col md={6} lg={3} key={index} className="mb-4">
                <Link href={feature.link} className="text-decoration-none">
                  <Card className="h-100 feature-card">
                    <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                      <div className="icon-wrapper mb-3 text-primary">{feature.icon}</div>
                      <Card.Title>{feature.title}</Card.Title>
                      <Card.Text className="text-muted">{feature.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="info-section py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h2 className="mb-4">About Bill Generator</h2>
              <p>Our bill generator is a free tool that allows you to easily create digital copies of bills, receipts, and other documents for personal record keeping or as proof of purchase.</p>
              <p>To get started, simply select a bill generator from the navigation bar above. Each bill generator has a simple form that you can fill out with the relevant information.</p>
              <div className="d-flex gap-2 mt-4">
                <Button variant="outline-primary" onClick={() => handleShow("disclaimer")} className="d-flex align-items-center gap-2">
                  <Shield size={18} />
                  Disclaimer
                </Button>
                <Button variant="outline-primary" onClick={() => handleShow("terms")} className="d-flex align-items-center gap-2">
                  <FileText size={18} />
                  Terms of Use
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3 text-primary">
                      <Info size={24} />
                    </div>
                    <h3 className="mb-0">Important Note</h3>
                  </div>
                  <p className="mb-0">
                    Our bill generator is designed for personal use or testing purposes only. We do not encourage or condone any illegal or fraudulent activities, including the creation of fake bills or the use of our bill generator for
                    such purposes.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <Modal show={showModal === "disclaimer"} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Disclaimer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This bill generator is intended for personal use or testing purposes only. We do not encourage or condone any illegal or fraudulent activities, including the creation of fake bills or the use of our bill generator for such
            purposes. The generated bills should only be used as a digital copy for personal record keeping or as proof of purchase. We are not responsible for any misuse of the bill generator or the generated bills. By using this bill
            generator, you agree to use it responsibly and in compliance with all applicable laws and regulations.
          </p>
        </Modal.Body>
      </Modal>

      <Modal show={showModal === "terms"} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Terms of Use</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Welcome to our bill generator! By accessing or using our bill generator, you agree to be bound by the following terms and conditions:</p>
          <ul>
            <li>The bill generator is provided for personal use or testing purposes only. You are not allowed to use the bill generator for any illegal or fraudulent activities, including the creation of fake bills.</li>
            <li>You are solely responsible for the use of the bill generator and the generated bills. We are not responsible for any damages, losses, or liabilities arising from your use of the bill generator or the generated bills.</li>
            <li>You are not allowed to modify, distribute, reproduce, or sell the bill generator or the generated bills without our prior written consent.</li>
            <li>We reserve the right to modify, suspend, or terminate the bill generator at any time without prior notice.</li>
            <li>
              We reserve the right to modify these terms and conditions at any time without prior notice. Your continued use of the bill generator after such modifications will constitute your acceptance of the new terms and conditions.
            </li>
            <li>
              These terms and conditions are governed by and construed in accordance with the laws of Maharashtra. Any disputes arising from or related to the bill generator or these terms and conditions shall be subject to the exclusive
              jurisdiction of the courts of Maharashtra.
            </li>
          </ul>
          <p>By using our bill generator, you acknowledge that you have read, understood, and agreed to these terms and conditions. If you do not agree to these terms and conditions, you should not use the bill generator.</p>
        </Modal.Body>
      </Modal>
    </>
  );
}
