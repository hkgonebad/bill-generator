"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Container, Row, Col, Card, Button, ProgressBar, Badge } from "react-bootstrap";
import Header from "@/components/Header";
import { FileText, History, LayoutDashboard, Calendar, BarChart, Clock } from "lucide-react";
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
        <Container className="mt-4">
          <p>Loading...</p>
        </Container>
      </>
    );
  }

  if (status === "authenticated" && session) {
    // Calculate credit usage percentage
    const usagePercentage = (credits.weeklyBillsGenerated / credits.weeklyBillsLimit) * 100;
    const daysUntilReset = credits.lastReset ? moment(credits.lastReset).add(7, "days").diff(moment(), "days") : 0;

    return (
      <>
        <Header title="Dashboard" subtitle="Create and manage your bills" icon={<LayoutDashboard size={24} />} showButton={false} />
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
                <Card.Header className="d-flex align-items-center">
                  <BarChart size={18} className="me-2" />
                  <h5 className="m-0">Credit Usage</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={7}>
                      <div className="d-flex align-items-center mb-3">
                        <div className="me-3">
                          <div
                            className="p-3 rounded-circle"
                            style={{
                              background: usagePercentage >= 80 ? "#dc3545" : usagePercentage >= 50 ? "#ffc107" : "#0d6efd",
                              width: "60px",
                              height: "60px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <h3 className="mb-0 text-white">{credits.weeklyBillsGenerated}</h3>
                          </div>
                        </div>
                        <div>
                          <h5 className="mb-1">Weekly Bills Generated</h5>
                          <p className="mb-0 text-muted">
                            <small>{credits.weeklyBillsGenerated < credits.weeklyBillsLimit ? `You can generate ${credits.weeklyBillsLimit - credits.weeklyBillsGenerated} more bills this week` : "You've reached your weekly limit"}</small>
                          </p>
                        </div>
                      </div>

                      <ProgressBar now={usagePercentage} variant={usagePercentage >= 80 ? "danger" : usagePercentage >= 50 ? "warning" : "primary"} className="mb-2" style={{ height: "10px" }} />
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">0</small>
                        <small className="text-muted">{credits.weeklyBillsLimit}</small>
                      </div>
                    </Col>

                    <Col md={5} className="mt-3 mt-md-0">
                      <div className="border rounded p-3 text-center">
                        <div className="d-flex align-items-center justify-content-center mb-2">
                          <Clock size={18} className="me-2 text-primary" />
                          <h6 className="mb-0">Next Reset</h6>
                        </div>
                        <h4 className="mb-1">{credits.lastReset ? moment(credits.lastReset).add(7, "days").format("DD MMM YYYY") : "Not available"}</h4>
                        {daysUntilReset > 0 && (
                          <Badge bg={daysUntilReset <= 1 ? "danger" : daysUntilReset <= 3 ? "warning" : "info"}>
                            {daysUntilReset} {daysUntilReset === 1 ? "day" : "days"} remaining
                          </Badge>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="m-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Button variant="outline-primary" className="w-100 py-3" onClick={() => router.push("/fuel-bill")}>
                        <FileText size={20} className="me-2 " />
                        Generate Fuel Bill
                      </Button>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Button variant="outline-primary" className="w-100 py-3" onClick={() => router.push("/rent-receipt")}>
                        <FileText size={20} className="me-2 " />
                        Generate Rent Receipt
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="mb-4">
                <Card.Header className="d-flex align-items-center">
                  <History size={18} className="me-2" />
                  <h5 className="m-0">Recently Generated</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {isLoading ? (
                    <p className="p-3">Loading recent bills...</p>
                  ) : error ? (
                    <p className="text-danger p-3">{error}</p>
                  ) : bills.length === 0 ? (
                    <p className="p-3">No bills generated yet.</p>
                  ) : (
                    <div className="list-group list-group-flush">
                      {bills.slice(0, 5).map((bill: any) => (
                        <a
                          key={bill._id}
                          href={`/${bill.billType === "fuel" ? "fuel-bill" : "rent-receipt"}?edit=${bill._id}`}
                          className="list-group-item list-group-item-action"
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/${bill.billType === "fuel" ? "fuel-bill" : "rent-receipt"}?edit=${bill._id}`);
                          }}
                        >
                          <div className="d-flex w-100 justify-content-between align-items-center">
                            <h6 className="mb-1 text-truncate" style={{ maxWidth: "70%" }}>
                              {bill.name}
                            </h6>
                            <small className="text-muted">{moment(bill.createdAt).fromNow()}</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <Badge bg={bill.billType === "fuel" ? "success" : "info"} className="me-2">
                              {bill.billType === "fuel" ? "Fuel" : "Rent"}
                            </Badge>
                            <small className="text-muted">{bill.billType === "fuel" ? `₹${bill.fsTotal?.toFixed(2) || "0.00"}` : `₹${bill.rentAmount?.toFixed(2) || "0.00"}`}</small>
                          </div>
                        </a>
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
