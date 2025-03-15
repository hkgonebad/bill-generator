"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Container, Row, Col, Card, Button, ProgressBar } from "react-bootstrap";
import NavbarComponent from "@/components/NavbarApp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoice, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

export default function DashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Add state for credits
  const [credits, setCredits] = useState({
    weeklyBillsGenerated: 0,
    weeklyBillsLimit: 5,
    lastReset: null as string | null,
  });

  // Function to fetch credits
  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/credits");
      if (response.ok) {
        const data = await response.json();
        setCredits(data);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };

  // Function to fetch bills
  const fetchBills = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/bills");
      if (response.ok) {
        const data = await response.json();
        setBills(data.bills);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
      setError("Failed to load bills");
    } finally {
      setIsLoading(false);
    }
  };

  // Check session and fetch data
  useEffect(() => {
    if (status === "authenticated") {
      fetchBills();
      fetchCredits();

      // Set up polling for credit updates
      const creditsPollInterval = setInterval(fetchCredits, 10000); // Poll every 10 seconds

      return () => {
        clearInterval(creditsPollInterval);
      };
    } else if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <>
        <NavbarComponent />
        <Container className="mt-4">
          <p>Loading...</p>
        </Container>
      </>
    );
  }

  if (status === "authenticated" && session) {
    return (
      <>
        <NavbarComponent />
        <Container className="mt-4 mb-5">
          <Row>
            <Col lg={8}>
              <Card className="mb-4">
                <Card.Body>
                  <h4 className="mb-3">Welcome back, {session.user?.name}!</h4>
                  <p className="text-muted">Manage your bills and account settings here.</p>
                </Card.Body>
              </Card>

              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Credit Usage</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col>
                      <h6>Weekly Bills Generated</h6>
                      <p className="h4 mb-0">
                        {credits.weeklyBillsGenerated} / {credits.weeklyBillsLimit}
                      </p>
                    </Col>
                    <Col>
                      <h6>Next Reset</h6>
                      <p className="h4 mb-0">{credits.lastReset ? moment(credits.lastReset).add(7, "days").format("DD MMM YYYY") : "Not available"}</p>
                    </Col>
                  </Row>
                  <div className="mt-3">
                    <ProgressBar
                      now={(credits.weeklyBillsGenerated / credits.weeklyBillsLimit) * 100}
                      label={`${credits.weeklyBillsGenerated}/${credits.weeklyBillsLimit}`}
                      variant={credits.weeklyBillsGenerated >= credits.weeklyBillsLimit ? "danger" : "primary"}
                    />
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Button variant="outline-primary" className="w-100 py-3" onClick={() => router.push("/fuel-bill")}>
                        <FontAwesomeIcon icon={faFileInvoice} className="me-2" />
                        Generate Fuel Bill
                      </Button>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Button variant="outline-primary" className="w-100 py-3" onClick={() => router.push("/rent-receipt")}>
                        <FontAwesomeIcon icon={faFileInvoice} className="me-2" />
                        Generate Rent Receipt
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">
                    <FontAwesomeIcon icon={faClockRotateLeft} className="me-2" />
                    Recently Generated
                  </h5>
                </Card.Header>
                <Card.Body>
                  {isLoading ? (
                    <p>Loading recent bills...</p>
                  ) : error ? (
                    <p className="text-danger">{error}</p>
                  ) : bills.length === 0 ? (
                    <p>No bills generated yet.</p>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {bills.slice(0, 5).map((bill: any) => (
                        <Button key={bill._id} variant="outline-secondary" className="text-start" onClick={() => router.push(`/${bill.billType === "fuel" ? "fuel-bill" : "rent-receipt"}?edit=${bill._id}`)}>
                          <small className="d-block text-muted">{moment(bill.createdAt).format("DD MMM YYYY")}</small>
                          {bill.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return null;
}
