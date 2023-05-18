import Head from 'next/head';
import CustomNavbar from '../components/Navbar';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState, useRef, useEffect } from "react";

import QRCode from "qrcode";
import html2canvas from 'html2canvas';

const QRCodeGenerator = () => {
  const [qrValue, setQrValue] = useState("https://awzdigital.com"); // Add a default value for qrValue
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    QRCode.toCanvas(canvas, qrValue, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 200,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  }, [qrValue]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const inputValue = e.target.elements.qrCodeGen.value;
    if (inputValue.trim() !== "") {
      // Check if input value is not empty
      setQrValue(inputValue);
    }
  };

  const generateJPG = () => {
    const content = document.getElementById('qrcode');
    if (!content) {
      return;
    }
  
    html2canvas(content).then(canvas => {
      const imgData = canvas.toDataURL('image/png', 1);
      const link = document.createElement('a');
      link.download = `qrcode.png`;
      link.href = imgData;
      link.click();
    });
};

  return (
    <>
      <Head>
        <title>QR Code Generator</title>
      </Head>

      <CustomNavbar />

      <section className="block">
        <Container>
          <h1 className="pageTitle">QR Code Generator</h1>

          <Row>
            <Col md={6}>
              <h5>Enter any URL or Text to convert to QR Code</h5>

              <form onSubmit={handleFormSubmit}>
                <Form.Group controlId='qrCodeGen' className='mb-2'>
                    <Form.Label>Enter URL or Text</Form.Label>
                    <Form.Control type="text" placeholder='Enter URL or any Text' />
                </Form.Group>
                <div className="btns">
                    <Button variant="primary" type="submit">Generate QR</Button>
                </div>
              </form>
            </Col>

            <Col md={6}>
              <h5>QR Code</h5>
              <canvas id="qrcode" ref={canvasRef} />

              <div className="btns">
                <Button variant="primary" onClick={generateJPG}>Download QR</Button>
              </div>
            </Col>
          </Row>

          
        </Container>
      </section>
    </>
  );
};

export default QRCodeGenerator;
