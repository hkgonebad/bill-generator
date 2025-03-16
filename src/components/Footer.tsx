"use client";

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Github, Mail, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer py-4 mt-auto">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <span className="text-muted">© {currentYear} Bill Generator. All rights reserved.</span>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="mailto:contact@example.com" className="text-muted" aria-label="Email">
                <Mail size={18} />
              </a>
              <span className="text-muted d-flex align-items-center">
                Made with <Heart size={14} className="mx-1" /> in React
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
