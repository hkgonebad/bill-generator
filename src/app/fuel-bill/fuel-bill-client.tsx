"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import NavbarComponent from "@/components/NavbarApp";
import moment from "moment";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import html2canvas from "html2canvas";

// Import fuel bill templates
import FuelTemplate1 from "@/fuel/template1";
import FuelTemplate2 from "@/fuel/template2";

// Import logos
import hpLogo from "@/assets/img/fuel/HP-grayscale.png";
import ioLogo from "@/assets/img/fuel/oil-grayscale.png";
import bpLogo from "@/assets/img/fuel/Bharat-grayscale.png";
import eoLogo from "@/assets/img/fuel/Essar-grayscale.png";

export default function FuelBillClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit");

  // State variables
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [selectedBrand, setSelectedBrand] = useState("bp");
  const [fsName, setFsName] = useState("");
  const [fsAddress, setFsAddress] = useState("");
  const [fsTel, setFsTel] = useState("");
  const [fsRate, setFsRate] = useState<number>(0);
  const [fsTotal, setFsTotal] = useState<number>(0);
  const [fsVolume, setFsVolume] = useState<number>(0);
  const [csName, setCsName] = useState("Not Entered");
  const [csTel, setCsTel] = useState("Not Entered");
  const [vehNumber, setVehNumber] = useState("Not Entered");
  const [vehType, setVehType] = useState("Not Entered");
  const [paymentType, setPaymentType] = useState("");
  const [selectedTaxOption, setSelectedTaxOption] = useState("none");
  const [taxNumber, setTaxNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savingToAccount, setSavingToAccount] = useState(false);
  const [billName, setBillName] = useState("");

  // Date and time state
  const now = new Date();
  const formattedDate = moment(now).format("DD/MM/YYYY");
  const formattedTime = moment(now).format("hh:mm");
  const [fsDate, setFsDate] = useState(formattedDate);
  const [fsTime, setFsTime] = useState(formattedTime);

  // Invoice number generation
  const invoiceDate = moment(now).format("DDMMYYYY");
  const invoiceTime = moment(now).format("hhmm");
  const randInvoiceGen = invoiceDate + invoiceTime;
  const [invoiceNumber, setInvoiceNumber] = useState(randInvoiceGen);

  // Template components mapping
  const templateComponents: { [key: string]: React.ComponentType<any> } = {
    template1: FuelTemplate1,
    template2: FuelTemplate2,
  };

  const SelectedTemplateComponent = templateComponents[selectedTemplate];

  // Logo selection
  let selectedLogo;
  switch (selectedBrand) {
    case "hp":
      selectedLogo = hpLogo;
      break;
    case "io":
      selectedLogo = ioLogo;
      break;
    case "bp":
      selectedLogo = bpLogo;
      break;
    case "eo":
      selectedLogo = eoLogo;
      break;
    default:
      selectedLogo = bpLogo;
  }

  // Calculate volume when rate or total changes
  useEffect(() => {
    const voldivide = fsTotal / fsRate;
    const volume = fsRate !== 0 ? parseFloat(voldivide.toFixed(2)) : 0;
    setFsVolume(volume);
  }, [fsRate, fsTotal]);

  // Generate a new invoice number whenever fsDate or fsTime changes
  useEffect(() => {
    const newInvoiceDate = moment(fsDate, "DD/MM/YYYY").format("DDMMYYYY");
    const newInvoiceTime = fsTime.replace(":", "");
    const newInvoiceNumber = newInvoiceDate + newInvoiceTime;
    setInvoiceNumber(newInvoiceNumber);
  }, [fsDate, fsTime]);

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

          // Set all the form fields
          setSelectedTemplate(bill.template || "template1");
          setSelectedBrand(bill.brand || "bp");
          setFsName(bill.fsName || "");
          setFsAddress(bill.fsAddress || "");
          setFsTel(bill.fsTel || "");
          setFsRate(bill.fsRate || 0);
          setFsTotal(bill.fsTotal || 0);
          setFsVolume(bill.fsVolume || 0);
          setCsName(bill.csName || "Not Entered");
          setCsTel(bill.csTel || "Not Entered");
          setVehNumber(bill.vehNumber || "Not Entered");
          setVehType(bill.vehType || "Not Entered");
          setPaymentType(bill.paymentType || "");
          setSelectedTaxOption(bill.taxOption || "none");
          setTaxNumber(bill.taxNumber || "");
          setFsDate(bill.fsDate || formattedDate);
          setFsTime(bill.fsTime || formattedTime);
          setInvoiceNumber(bill.invoiceNumber || randInvoiceGen);
          setBillName(bill.name || "");
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

  // Add validation state
  const [validated, setValidated] = useState(false);

  // Add field validation states
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Validate individual field
  const validateField = (field: string, value: any) => {
    let error = "";

    switch (field) {
      case "template":
        if (!value) error = "Template is required";
        break;
      case "brand":
        if (!value) error = "Brand is required";
        break;
      case "fsName":
        if (!value) error = "Fuel station name is required";
        break;
      case "fsAddress":
        if (!value) error = "Fuel station address is required";
        break;
      case "fsRate":
        if (!value) error = "Rate is required";
        else if (value <= 0) error = "Rate must be greater than 0";
        break;
      case "fsTotal":
        if (!value) error = "Total amount is required";
        else if (value <= 0) error = "Total amount must be greater than 0";
        break;
      case "fsDate":
        if (!value) error = "Date is required";
        break;
      case "fsTime":
        if (!value) error = "Time is required";
        break;
      default:
        break;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    return !error;
  };

  // Handle field blur
  const handleBlur = (field: string, value: any) => {
    validateField(field, value);
  };

  // Form change handlers
  const handleTemplateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(event.target.value);
  };

  const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(event.target.value);
  };

  const handleFsTotalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    const roundedValue = Math.round(value * 100) / 100; // Round to two decimal places
    setFsTotal(roundedValue);
  };

  const isValidDate = (current: moment.Moment) => {
    return current.isBefore(moment());
  };

  function restrictToNumbers(event: React.KeyboardEvent<HTMLInputElement>) {
    // Get the key code of the pressed key
    const keyCode = event.which || event.keyCode;

    // Allow only numbers and one decimal point
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      event.preventDefault();
    } else if (keyCode === 46 && event.currentTarget.value.includes(".")) {
      event.preventDefault();
    }
  }

  const handleTaxOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTaxOption(event.target.value);
  };

  // Validate form before generating PDF
  const validateForm = () => {
    // Required fields based on the schema
    if (!fsName || !fsAddress || !fsRate || !fsTotal || !fsVolume || !fsDate || !fsTime || !selectedTemplate || !selectedBrand) {
      setError("Please fill in all required fields");
      setValidated(true);
      return false;
    }

    // Validate numeric fields
    if (fsRate <= 0) {
      setError("Rate must be greater than 0");
      return false;
    }

    if (fsTotal <= 0) {
      setError("Total must be greater than 0");
      return false;
    }

    setError("");
    return true;
  };

  // Generate JPG of the bill
  const generateJPG = async () => {
    if (!validateForm()) {
      return;
    }

    const previewArea = document.getElementById("previewArea");
    if (!previewArea) return;

    try {
      const canvas = await html2canvas(previewArea, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `FuelBill_${invoiceNumber}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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
      console.error("Error generating JPG:", error);
      setError("Failed to generate bill image. Please try again.");
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

      const billData = {
        name: billName || `Fuel Bill - ${fsName} - ${fsDate}`,
        template: selectedTemplate,
        brand: selectedBrand,
        fsName,
        fsAddress,
        fsTel,
        fsRate,
        fsTotal,
        fsVolume,
        fsDate,
        fsTime,
        csName,
        vehNumber,
        vehType,
        paymentType,
        invoiceNumber,
        taxOption: selectedTaxOption,
        taxNumber,
      };

      const url = editMode ? `/api/bills/${editMode}` : "/api/bills";
      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billType: "fuel",
          ...billData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error saving bill");
      }

      setSuccess(editMode ? "Bill updated successfully!" : "Bill saved to your account successfully!");

      if (editMode) {
        // Stay on the same page after updating
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        // Redirect to dashboard after creating new bill
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving bill:", error);
      setError((error as Error).message || "Failed to save bill to your account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarComponent />
      <section className="fuel-bill">
        <Container>
          <h1 className="text-center mb-4">Fuel Bill Generator</h1>

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

          <Row>
            <Col md={6}>
              <div className="form-container">
                <Form noValidate validated={validated}>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="template">
                        <Form.Label>
                          Template <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} onBlur={() => handleBlur("template", selectedTemplate)} required isInvalid={!!fieldErrors.template}>
                          <option value="template1">Template 1</option>
                          <option value="template2">Template 2</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{fieldErrors.template || "Please select a template."}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="brand">
                        <Form.Label>
                          Brand <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} onBlur={() => handleBlur("brand", selectedBrand)} required isInvalid={!!fieldErrors.brand}>
                          <option value="bp">Bharat Petroleum</option>
                          <option value="hp">Hindustan Petroleum</option>
                          <option value="io">Indian Oil</option>
                          <option value="eo">Essar Oil</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{fieldErrors.brand || "Please select a brand."}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group controlId="fsName">
                        <Form.Label>
                          Fuel Station Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control type="text" value={fsName} onChange={(e) => setFsName(e.target.value)} onBlur={() => handleBlur("fsName", fsName)} placeholder="Enter Fuel Station Name" required isInvalid={!!fieldErrors.fsName} />
                        <Form.Control.Feedback type="invalid">{fieldErrors.fsName || "Please enter the fuel station name."}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group controlId="fsAddress">
                        <Form.Label>
                          Fuel Station Address <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={fsAddress}
                          onChange={(e) => setFsAddress(e.target.value)}
                          onBlur={() => handleBlur("fsAddress", fsAddress)}
                          placeholder="Enter Fuel Station Address"
                          required
                          isInvalid={!!fieldErrors.fsAddress}
                        />
                        <Form.Control.Feedback type="invalid">{fieldErrors.fsAddress || "Please enter the fuel station address."}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group controlId="fsTel">
                        <Form.Label>Fuel Station Tel</Form.Label>
                        <Form.Control type="text" value={fsTel} onChange={(e) => setFsTel(e.target.value)} placeholder="Enter Fuel Station Tel" />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="fsRate">
                        <Form.Label>
                          Rate (₹) <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={fsRate}
                          onChange={(e) => setFsRate(parseFloat(e.target.value))}
                          onBlur={() => handleBlur("fsRate", fsRate)}
                          onKeyDown={restrictToNumbers}
                          placeholder="Enter Rate"
                          required
                          isInvalid={!!fieldErrors.fsRate}
                        />
                        <Form.Control.Feedback type="invalid">{fieldErrors.fsRate || "Please enter a valid rate."}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="fsTotal">
                        <Form.Label>
                          Total (₹) <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={fsTotal}
                          onChange={handleFsTotalChange}
                          onBlur={() => handleBlur("fsTotal", fsTotal)}
                          onKeyDown={restrictToNumbers}
                          placeholder="Enter Total"
                          required
                          isInvalid={!!fieldErrors.fsTotal}
                        />
                        <Form.Control.Feedback type="invalid">{fieldErrors.fsTotal || "Please enter a valid total amount."}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group controlId="fsVolume">
                        <Form.Label>
                          Volume (Liters) <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control type="number" value={fsVolume} readOnly disabled />
                        <Form.Text className="text-muted">Auto-calculated</Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group controlId="fsDate">
                        <Form.Label>
                          Date <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control type="text" value={fsDate} onChange={(e) => setFsDate(e.target.value)} onBlur={() => handleBlur("fsDate", fsDate)} placeholder="DD/MM/YYYY" required isInvalid={!!fieldErrors.fsDate} />
                        <Form.Control.Feedback type="invalid">{fieldErrors.fsDate || "Please enter a date."}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group controlId="fsTime">
                        <Form.Label>
                          Time <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control type="text" value={fsTime} onChange={(e) => setFsTime(e.target.value)} onBlur={() => handleBlur("fsTime", fsTime)} placeholder="HH:MM" required isInvalid={!!fieldErrors.fsTime} />
                        <Form.Control.Feedback type="invalid">{fieldErrors.fsTime || "Please enter a time."}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="csName">
                        <Form.Label>Customer Name</Form.Label>
                        <Form.Control type="text" value={csName} onChange={(e) => setCsName(e.target.value)} placeholder="Enter Customer Name" />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="csTel">
                        <Form.Label>Customer Tel</Form.Label>
                        <Form.Control type="text" value={csTel} onChange={(e) => setCsTel(e.target.value)} placeholder="Enter Customer Tel" />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="vehNumber">
                        <Form.Label>Vehicle Number</Form.Label>
                        <Form.Control type="text" value={vehNumber} onChange={(e) => setVehNumber(e.target.value)} placeholder="Enter Vehicle Number" />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="vehType">
                        <Form.Label>Vehicle Type</Form.Label>
                        <Form.Control type="text" value={vehType} onChange={(e) => setVehType(e.target.value)} placeholder="Enter Vehicle Type" />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group controlId="paymentType">
                        <Form.Label>Payment Type</Form.Label>
                        <Form.Select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                          <option value="">Select Payment Type</option>
                          <option value="Cash">Cash</option>
                          <option value="Card">Card</option>
                          <option value="UPI">UPI</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Label>Tax Option</Form.Label>
                      <div className="d-flex gap-3">
                        <Form.Check type="radio" id="taxOptionNone" label="None" name="taxOption" value="none" checked={selectedTaxOption === "none"} onChange={handleTaxOption} />
                        <Form.Check type="radio" id="taxOptionGST" label="GST No." name="taxOption" value="GST No." checked={selectedTaxOption === "GST No."} onChange={handleTaxOption} />
                        <Form.Check type="radio" id="taxOptionTIN" label="TIN No." name="taxOption" value="TIN No." checked={selectedTaxOption === "TIN No."} onChange={handleTaxOption} />
                      </div>
                    </Col>

                    {selectedTaxOption !== "none" && (
                      <Col md={12}>
                        <Form.Group controlId="taxNumber">
                          <Form.Label>Enter {selectedTaxOption}</Form.Label>
                          <Form.Control type="text" value={taxNumber} onChange={(e) => setTaxNumber(e.target.value)} />
                        </Form.Group>
                      </Col>
                    )}

                    {status === "authenticated" && (
                      <Col md={12} className="mt-3">
                        <Form.Group controlId="billName">
                          <Form.Label>Bill Name (for saving to your account)</Form.Label>
                          <Form.Control type="text" value={billName} onChange={(e) => setBillName(e.target.value)} placeholder={`Fuel Bill - ${fsName || "Unnamed"} - ${fsDate}`} />
                        </Form.Group>

                        <Form.Check type="checkbox" id="saveToAccount" label="Save to my account" checked={savingToAccount} onChange={(e) => setSavingToAccount(e.target.checked)} className="mt-2" />
                      </Col>
                    )}

                    <Col md={12} className="mt-3">
                      <div className="d-flex gap-2">
                        <Button variant="primary" onClick={generateJPG} disabled={loading || (!fsName && !fsRate && !fsTotal)}>
                          {loading ? "Processing..." : "Generate Bill"}
                        </Button>

                        {status === "authenticated" && !savingToAccount && (
                          <Button variant="success" onClick={saveBill} disabled={loading}>
                            {editMode ? "Update Bill" : "Save to Account"}
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>

            <Col md={6}>
              <div className="previewArea" id="previewArea">
                <SelectedTemplateComponent
                  logo={selectedLogo}
                  fsName={fsName}
                  fsAddress={fsAddress}
                  fsTel={fsTel}
                  fsRate={fsRate}
                  fsTotal={fsTotal}
                  fsVolume={fsVolume}
                  fsDate={fsDate}
                  fsTime={fsTime}
                  csName={csName}
                  csTel={csTel}
                  vehNumber={vehNumber}
                  vehType={vehType}
                  paymentType={paymentType}
                  invoiceNumber={invoiceNumber}
                  selectedTaxOption={selectedTaxOption}
                  taxNumber={taxNumber}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
