"use client";

import { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import NavbarComponent from "@/components/NavbarApp";
import QRCode from "qrcode";
import html2canvas from "html2canvas";

export default function QRCodeGeneratorClient() {
  const [qrValue, setQrValue] = useState("https://example.com");
  const [qrColor, setQrColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#FFFFFF");
  const [qrSize, setQrSize] = useState(200);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR code whenever parameters change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    QRCode.toCanvas(canvas, qrValue || "https://example.com", {
      errorCorrectionLevel: "H",
      margin: 2,
      width: qrSize,
      color: {
        dark: qrColor,
        light: qrBgColor,
      },
    });
  }, [qrValue, qrColor, qrBgColor, qrSize]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("qrCodeGen") as HTMLInputElement;

    if (input && input.value.trim() !== "") {
      setQrValue(input.value);
    }
  };

  const generateImage = () => {
    const content = document.getElementById("qrcode-container");
    if (!content) return;

    html2canvas(content, {
      backgroundColor: qrBgColor,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1);
      const link = document.createElement("a");
      link.download = `qrcode-${Date.now()}.png`;
      link.href = imgData;
      link.click();
    });
  };

  return (
    <>
      <NavbarComponent />
      <Container className="mt-4 mb-5">
        <h1 className="text-center mb-4">QR Code Generator</h1>

        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Generate QR Code</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleFormSubmit}>
                  <Form.Group controlId="qrCodeGen" className="mb-3">
                    <Form.Label>Enter URL or Text</Form.Label>
                    <Form.Control type="text" placeholder="Enter URL or any text" defaultValue={qrValue} />
                    <Form.Text className="text-muted">Enter any URL, text, or data you want to encode in the QR code</Form.Text>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="qrColor" className="mb-3">
                        <Form.Label>QR Code Color</Form.Label>
                        <Form.Control type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} title="Choose QR code color" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="qrBgColor" className="mb-3">
                        <Form.Label>Background Color</Form.Label>
                        <Form.Control type="color" value={qrBgColor} onChange={(e) => setQrBgColor(e.target.value)} title="Choose background color" />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group controlId="qrSize" className="mb-3">
                    <Form.Label>QR Code Size: {qrSize}px</Form.Label>
                    <Form.Range min={100} max={400} step={10} value={qrSize} onChange={(e) => setQrSize(parseInt(e.target.value))} />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit">
                      Generate QR Code
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="d-flex flex-column align-items-center">
            <Card className="w-100 mb-4">
              <Card.Header>
                <h5 className="mb-0">Your QR Code</h5>
              </Card.Header>
              <Card.Body className="text-center">
                <div id="qrcode-container" className="p-3 d-inline-block" style={{ backgroundColor: qrBgColor }}>
                  <canvas id="qrcode" ref={canvasRef} />
                </div>
                <div className="text-muted mt-2 small">
                  <p>Content: {qrValue}</p>
                </div>
              </Card.Body>
              <Card.Footer>
                <div className="d-grid">
                  <Button variant="success" onClick={generateImage}>
                    Download QR Code
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
