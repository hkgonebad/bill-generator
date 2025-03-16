import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
  buttonVariant?: string;
  icon?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, showButton = true, buttonText = "Get Started", buttonLink = "/tools", buttonVariant = "primary", icon = <FileText size={24} /> }) => {
  return (
    <div className="page-header py-4 mb-4">
      <Container>
        <Row className="align-items-center">
          <Col lg={8}>
            <div className="d-flex align-items-center mb-2">
              <div className="header-icon me-3">{icon}</div>
              <h1 className="mb-0">{title}</h1>
            </div>
            {subtitle && <p className="lead text-muted mb-0">{subtitle}</p>}
          </Col>
          {showButton && (
            <Col lg={4} className="text-lg-end mt-3 mt-lg-0">
              <Link href={buttonLink} passHref>
                <Button variant={buttonVariant} className="d-inline-flex align-items-center gap-2">
                  {buttonText}
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Header;
