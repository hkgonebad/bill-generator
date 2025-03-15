"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Row, Col, Form, Button, Alert, Card, Tab, Nav } from "react-bootstrap";
import NavbarComponent from "@/components/NavbarApp";
import moment from "moment";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Template1 from "@/components/rent/Template1";
import Template2 from "@/components/rent/Template2";
import TemplateSelector from "@/components/rent/TemplateSelector";
import LiveEditor from "@/components/rent/LiveEditor";
import { convertNumberToWords } from "@/utils/numberToWords";

export default function RentReceiptClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit");

  // State variables
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [receiptData, setReceiptData] = useState({
    landlordName: "",
    landlordAddress: "",
    tenantName: "",
    tenantAddress: "",
    rentAmount: 0,
    paymentDate: moment().format("YYYY-MM-DD"),
    paymentMode: "Cash",
    receiptNumber: `RENT${moment().format("YYYYMMDD")}${Math.floor(Math.random() * 1000)}`,
    panNumber: "",
    rentPeriod: {
      from: moment().startOf("month").format("YYYY-MM-DD"),
      to: moment().endOf("month").format("YYYY-MM-DD"),
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savingToAccount, setSavingToAccount] = useState(false);
  const [billName, setBillName] = useState("");

  // Add validation state
  const [validated, setValidated] = useState(false);

  // Add field validation states
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Load bill data if in edit mode
  useEffect(() => {
    if (editMode) {
      const fetchBill = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/bills/${editMode}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch bill");
          }

          const bill = data.bill;

          // Set receipt data
          setReceiptData({
            landlordName: bill.landlordName || "",
            landlordAddress: bill.landlordAddress || "",
            tenantName: bill.tenantName || "",
            tenantAddress: bill.propertyAddress || "",
            rentAmount: bill.rentAmount || 0,
            paymentDate: bill.paymentDate || moment().format("YYYY-MM-DD"),
            paymentMode: bill.paymentMethod || "Cash",
            receiptNumber: bill.receiptNumber || `RENT${moment().format("YYYYMMDD")}${Math.floor(Math.random() * 1000)}`,
            panNumber: bill.panNumber || "",
            rentPeriod: {
              from: bill.periodStart || moment().startOf("month").format("YYYY-MM-DD"),
              to: bill.periodEnd || moment().endOf("month").format("YYYY-MM-DD"),
            },
          });

          setBillName(bill.name || "");
          setSavingToAccount(true);
          setSelectedTemplate(bill.templateId || 1);
        } catch (error) {
          console.error("Error fetching bill:", error);
          setError("Failed to load the bill for editing");
        } finally {
          setLoading(false);
        }
      };

      fetchBill();
    }
  }, [editMode, router]);

  // Check anonymous credits
  useEffect(() => {
    if (status === "unauthenticated") {
      const checkAnonymousCredits = async () => {
        try {
          const response = await fetch("/api/anonymous-credit");
          const data = await response.json();

          if (data.credits && data.credits.weeklyBillsGenerated >= 2) {
            setError("You have reached your weekly bill generation limit. Please sign in or create an account to generate more bills.");
          }
        } catch (error) {
          console.error("Error checking anonymous credits:", error);
        }
      };

      checkAnonymousCredits();
    }
  }, [status]);

  // Handle receipt data change
  const handleReceiptDataChange = (data: Partial<typeof receiptData>) => {
    setReceiptData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // Validate form before generating PDF
  const validateForm = () => {
    // Required fields
    if (!receiptData.landlordName || !receiptData.tenantName || !receiptData.rentAmount || !receiptData.rentPeriod.from || !receiptData.rentPeriod.to || !receiptData.paymentDate) {
      setError("Please fill in all required fields");
      setValidated(true);
      return false;
    }

    // Validate rent amount
    if (receiptData.rentAmount <= 0) {
      setError("Rent amount must be greater than 0");
      return false;
    }

    // Validate dates
    const startDate = moment(receiptData.rentPeriod.from);
    const endDate = moment(receiptData.rentPeriod.to);
    const paidDate = moment(receiptData.paymentDate);

    if (endDate.isBefore(startDate)) {
      setError("Period end date cannot be before start date");
      return false;
    }

    if (paidDate.isBefore(startDate)) {
      setError("Payment date cannot be before period start date");
      return false;
    }

    setError("");
    return true;
  };

  // Generate PDF of the receipt
  const generatePDF = async () => {
    if (!validateForm()) {
      return;
    }

    const receiptElement = document.getElementById("receiptPreview");
    if (!receiptElement) return;

    try {
      setLoading(true);

      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      pdf.save(`RentReceipt_${receiptData.receiptNumber}.pdf`);

      // Update anonymous credit if not logged in
      if (status === "unauthenticated") {
        try {
          await fetch("/api/anonymous-credit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.error("Error updating anonymous credit:", error);
        }
      }

      if (savingToAccount && status === "authenticated") {
        saveBill();
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate receipt. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save bill to user account
  const saveBill = async () => {
    if (!validateForm()) {
      return;
    }

    if (status !== "authenticated") {
      setError("You must be logged in to save bills to your account.");
      return;
    }

    try {
      setLoading(true);
      setSavingToAccount(true);

      const billData = {
        name: billName || `Rent Receipt - ${receiptData.tenantName} - ${receiptData.rentPeriod.from}`,
        landlordName: receiptData.landlordName,
        landlordAddress: receiptData.landlordAddress,
        tenantName: receiptData.tenantName,
        propertyAddress: receiptData.tenantAddress,
        rentAmount: receiptData.rentAmount,
        periodStart: receiptData.rentPeriod.from,
        periodEnd: receiptData.rentPeriod.to,
        paymentDate: receiptData.paymentDate,
        paymentMethod: receiptData.paymentMode,
        receiptNumber: receiptData.receiptNumber,
        showPanDetails: !!receiptData.panNumber,
        panNumber: receiptData.panNumber || "",
        templateId: selectedTemplate,
      };

      const url = editMode ? `/api/bills/${editMode}` : "/api/bills";
      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billType: "rent",
          ...billData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save receipt");
      }

      setSuccess(editMode ? "Receipt updated successfully!" : "Receipt saved to your account successfully!");

      if (editMode) {
        // Stay on the same page after updating
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        // Redirect to dashboard after creating new receipt
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving receipt:", error);
      setError((error as Error).message || "Failed to save receipt to your account");
    } finally {
      setLoading(false);
      setSavingToAccount(false);
    }
  };

  return (
    <>
      <NavbarComponent />
      <Container className="mt-4 mb-5">
        <h1 className="text-center mb-4">Rent Receipt Generator</h1>

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="mb-3">
            {success}
          </Alert>
        )}

        <TemplateSelector selectedTemplate={selectedTemplate} onSelectTemplate={setSelectedTemplate} />

        <Row>
          <Col md={6}>
            <Tab.Container defaultActiveKey="editor">
              <Card className="mb-4">
                <Card.Header>
                  <Nav variant="tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="editor">Edit Receipt</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="account">Account Settings</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                <Card.Body>
                  <Tab.Content>
                    <Tab.Pane eventKey="editor">
                      <LiveEditor receiptData={receiptData} onDataChange={handleReceiptDataChange} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="account">
                      <Form.Group className="mb-3">
                        <Form.Label>Receipt Name (for saving to your account)</Form.Label>
                        <Form.Control
                          type="text"
                          value={billName}
                          onChange={(e) => setBillName(e.target.value)}
                          placeholder={`Rent Receipt - ${receiptData.tenantName || "Tenant"} - ${moment(receiptData.rentPeriod.from).format("MMM YYYY")}`}
                        />
                      </Form.Group>

                      <Form.Check type="checkbox" id="saveToAccount" label="Save to my account" checked={savingToAccount} onChange={(e) => setSavingToAccount(e.target.checked)} className="mb-3" />

                      <div className="d-flex gap-2">
                        <Button variant="primary" onClick={generatePDF} disabled={loading || !receiptData.landlordName || !receiptData.tenantName || !receiptData.tenantAddress || !receiptData.rentAmount}>
                          {loading ? "Processing..." : "Generate Receipt"}
                        </Button>

                        {status === "authenticated" && !savingToAccount && (
                          <Button variant="success" onClick={saveBill} disabled={loading || !receiptData.landlordName || !receiptData.tenantName || !receiptData.tenantAddress || !receiptData.rentAmount}>
                            {editMode ? "Update Receipt" : "Save to Account"}
                          </Button>
                        )}
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Tab.Container>
          </Col>

          <Col md={6}>
            <div id="receiptPreview" className="preview-area">
              {selectedTemplate === 1 ? <Template1 {...receiptData} /> : <Template2 {...receiptData} />}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
