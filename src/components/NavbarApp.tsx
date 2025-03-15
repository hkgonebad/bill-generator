"use client";

import Link from "next/link";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { useSession, signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/context/ThemeContext";

const NavbarComponent = () => {
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const isAuthenticated = status === "authenticated";

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    signOut({ callbackUrl: "/" });
  };

  return (
    <Navbar bg={theme === "dark" ? "dark" : "light"} variant={theme === "dark" ? "dark" : "light"} expand="md" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand href="/">Bill Generator</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/fuel-bill" className="nav-link">
              Fuel Bill
            </Link>
            <Link href="/rent-receipt" className="nav-link">
              Rent Receipt
            </Link>
            <NavDropdown title="Tools" id="basic-nav-dropdown">
              <Link href="/tools" className="dropdown-item">
                All Tools
              </Link>
              <Link href="/qrcode-generator" className="dropdown-item">
                QR Code Generator
              </Link>
              <Link href="/weekly-time-calculator" className="dropdown-item">
                Time Calculator
              </Link>
            </NavDropdown>

            <Button variant={theme === "dark" ? "outline-light" : "outline-dark"} size="sm" className="mx-2 d-flex align-items-center" onClick={toggleTheme} title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
            </Button>

            {isAuthenticated ? (
              <NavDropdown
                title={
                  <span>
                    <FontAwesomeIcon icon={faUser} className="me-1" />
                    {session?.user?.name || "Account"}
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <Link href="/dashboard" className="dropdown-item">
                  Dashboard
                </Link>
                <Link href="/my-bills" className="dropdown-item">
                  My Bills
                </Link>
                <NavDropdown.Divider />
                <Button variant="link" className="dropdown-item text-danger" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </NavDropdown>
            ) : (
              <NavDropdown
                title={
                  <span>
                    <FontAwesomeIcon icon={faUser} className="me-1" />
                    Account
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <Link href="/auth/signin" className="dropdown-item">
                  Sign In
                </Link>
                <Link href="/auth/register" className="dropdown-item">
                  Register
                </Link>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
