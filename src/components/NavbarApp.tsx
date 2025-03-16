"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import { Sun, Moon, FileText, Calculator, Receipt, Fuel, User, Clock, QrCode, Home, LayoutGrid, LogOut, LogIn, UserPlus } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useSession, signOut } from "next-auth/react";

const NavbarApp = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    signOut({ callbackUrl: "/" });
  };

  return (
    <Navbar expand="lg" className="border-bottom py-2" bg={theme === "dark" ? "dark" : "light"} variant={theme === "dark" ? "dark" : "light"} sticky="top">
      <Container>
        <Link href="/" passHref legacyBehavior>
          <Navbar.Brand className="d-flex align-items-center">
            <FileText className="me-2" size={24} />
            <span>Bill Generator</span>
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link href="/" passHref legacyBehavior>
              <Nav.Link active={pathname === "/"} className="d-flex align-items-center">
                <Home size={16} className="me-1" />
                Home
              </Nav.Link>
            </Link>

            <Link href="/fuel-bill" passHref legacyBehavior>
              <Nav.Link active={pathname === "/fuel-bill"} className="d-flex align-items-center">
                <Fuel size={16} className="me-1" />
                Fuel Bill
              </Nav.Link>
            </Link>

            <Link href="/rent-receipt" passHref legacyBehavior>
              <Nav.Link active={pathname === "/rent-receipt"} className="d-flex align-items-center">
                <Receipt size={16} className="me-1" />
                Rent Receipt
              </Nav.Link>
            </Link>

            <NavDropdown
              title={
                <span className="d-flex align-items-center">
                  <LayoutGrid size={16} className="me-1" />
                  Tools
                </span>
              }
              id="tools-dropdown"
            >
              <Link href="/tools" passHref legacyBehavior>
                <NavDropdown.Item active={pathname === "/tools"} className="d-flex align-items-center">
                  <LayoutGrid size={16} className="me-2" />
                  All Tools
                </NavDropdown.Item>
              </Link>

              <Link href="/qrcode-generator" passHref legacyBehavior>
                <NavDropdown.Item active={pathname === "/qrcode-generator"} className="d-flex align-items-center">
                  <QrCode size={16} className="me-2" />
                  QR Code Generator
                </NavDropdown.Item>
              </Link>

              <Link href="/weekly-time-calculator" passHref legacyBehavior>
                <NavDropdown.Item active={pathname === "/weekly-time-calculator"} className="d-flex align-items-center">
                  <Clock size={16} className="me-2" />
                  Time Calculator
                </NavDropdown.Item>
              </Link>
            </NavDropdown>
          </Nav>

          <Nav>
            <Button
              variant={theme === "dark" ? "light" : "dark"}
              size="sm"
              className="me-2 d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px", padding: 0 }}
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </Button>

            {isAuthenticated ? (
              <NavDropdown
                title={
                  <span className="d-flex align-items-center">
                    <User size={16} className="me-1" />
                    {session?.user?.name || "Account"}
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <Link href="/dashboard" passHref legacyBehavior>
                  <NavDropdown.Item active={pathname === "/dashboard"} className="d-flex align-items-center">
                    <LayoutGrid size={16} className="me-2" />
                    Dashboard
                  </NavDropdown.Item>
                </Link>

                <Link href="/my-bills" passHref legacyBehavior>
                  <NavDropdown.Item active={pathname === "/my-bills"} className="d-flex align-items-center">
                    <FileText size={16} className="me-2" />
                    My Bills
                  </NavDropdown.Item>
                </Link>

                <NavDropdown.Divider />

                <NavDropdown.Item className="d-flex align-items-center text-danger" onClick={handleSignOut}>
                  <LogOut size={16} className="me-2" />
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown
                title={
                  <span className="d-flex align-items-center">
                    <User size={16} className="me-1" />
                    Account
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <Link href="/auth/signin" passHref legacyBehavior>
                  <NavDropdown.Item active={pathname === "/auth/signin"} className="d-flex align-items-center">
                    <LogIn size={16} className="me-2" />
                    Sign In
                  </NavDropdown.Item>
                </Link>

                <Link href="/auth/register" passHref legacyBehavior>
                  <NavDropdown.Item active={pathname === "/auth/register"} className="d-flex align-items-center">
                    <UserPlus size={16} className="me-2" />
                    Register
                  </NavDropdown.Item>
                </Link>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarApp;
