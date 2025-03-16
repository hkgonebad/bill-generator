"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Row, Col, Form, Button, Alert, Tab, Nav } from "react-bootstrap";
import Header from "@/components/Header";
import moment from "moment";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import html2canvas from "html2canvas";
import { Fuel } from "lucide-react";
import LiveEditor from "@/components/fuel/LiveEditor";
import TemplateSelector from "@/components/fuel/TemplateSelector";
import { jsPDF } from "jspdf";
import { generatePDF, checkCredits, updateCredits } from "@/utils/billGeneration";
import { required, minValue } from "@/utils/formValidation";

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Validate individual field
  const validateField = (field: string, value: any) => {
    let error = "";

    switch (field) {
      case "template":
        error = required("Template")(value) || "";
        break;
      case "brand":
        error = required("Brand")(value) || "";
        break;
      case "fsName":
        error = required("Fuel station name")(value) || "";
        break;
      case "fsAddress":
        error = required("Fuel station address")(value) || "";
        break;
      case "fsRate":
        error = required("Rate")(value) || minValue(0.01, "Rate")(value) || "";
        break;
      case "fsTotal":
        error = required("Total amount")(value) || minValue(0.01, "Total amount")(value) || "";
        break;
      case "fsDate":
        error = required("Date")(value) || "";
        break;
      case "fsTime":
        error = required("Time")(value) || "";
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

  // Generate PDF
  const handleGeneratePDF = async () => {
    if (!validateForm()) {
      return;
    }

    // Check credits
    try {
      const hasCredits = await checkCredits(status, setError);
      if (!hasCredits) return;
    } catch (error) {
      console.error("Error checking credits:", error);
      return;
    }

    const previewArea = document.getElementById("previewArea");
    if (!previewArea) return;

    try {
      setLoading(true);

      // Generate the PDF using the utility function
      await generatePDF({
        elementId: "previewArea",
        fileName: `FuelBill_${invoiceNumber}.pdf`,
        successCallback: async () => {
          try {
            // Update credits
            await updateCredits(status);

            // Save bill if needed
            if (savingToAccount && status === "authenticated") {
              saveBill();
            }
          } catch (error) {
            console.error("Error after PDF generation:", error);
          }
        },
        errorCallback: (error) => {
          console.error("Error generating PDF:", error);
          setError("Failed to generate bill. Please try again.");
        },
      });
    } catch (error) {
      console.error("Error in PDF generation:", error);
      setError("Failed to generate bill. Please try again.");
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

  // Add a handleDataChange function
  const handleDataChange = (field: string, value: any) => {
    switch (field) {
      case "selectedTemplate":
        setSelectedTemplate(value);
        break;
      case "selectedBrand":
        setSelectedBrand(value);
        break;
      case "fsName":
        setFsName(value);
        break;
      case "fsAddress":
        setFsAddress(value);
        break;
      case "fsTel":
        setFsTel(value);
        break;
      case "fsRate":
        setFsRate(value);
        break;
      case "fsTotal":
        setFsTotal(value);
        break;
      case "csName":
        setCsName(value);
        break;
      case "csTel":
        setCsTel(value);
        break;
      case "vehNumber":
        setVehNumber(value);
        break;
      case "vehType":
        setVehType(value);
        break;
      case "paymentType":
        setPaymentType(value);
        break;
      case "selectedTaxOption":
        setSelectedTaxOption(value);
        break;
      case "taxNumber":
        setTaxNumber(value);
        break;
      case "fsDate":
        setFsDate(value);
        break;
      case "fsTime":
        setFsTime(value);
        break;
      case "invoiceNumber":
        setInvoiceNumber(value);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Header title="Fuel Bill Generator" subtitle="Create professional fuel bills with automatic calculations" icon={<Fuel size={24} />} buttonText="View All Tools" buttonLink="/tools" />
      <Container className="mb-5">
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

        <TemplateSelector selectedTemplate={selectedTemplate} onSelectTemplate={(template) => setSelectedTemplate(template)} />

        <Row>
          <Col md={6}>
            <Tab.Container defaultActiveKey="editor">
              <Nav variant="tabs" className="">
                <Nav.Item>
                  <Nav.Link eventKey="editor">Edit Bill</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="account">Account Settings</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="editor">
                  <LiveEditor
                    fuelData={{
                      selectedTemplate,
                      selectedBrand,
                      fsName,
                      fsAddress,
                      fsTel,
                      fsRate,
                      fsTotal,
                      fsVolume,
                      csName,
                      csTel,
                      vehNumber,
                      vehType,
                      paymentType,
                      selectedTaxOption,
                      taxNumber,
                      fsDate,
                      fsTime,
                      invoiceNumber,
                      fieldErrors,
                      handleBlur,
                    }}
                    onDataChange={handleDataChange}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="account">
                  <div className="card card-body">
                    <Form.Group className="mb-3">
                      <Form.Label>Bill Name (for saving to your account)</Form.Label>
                      <Form.Control type="text" value={billName} onChange={(e) => setBillName(e.target.value)} placeholder={`Fuel Bill - ${fsName || "Station"} - ${moment().format("MMM YYYY")}`} />
                    </Form.Group>

                    <Form.Check type="checkbox" id="saveToAccount" label="Save to my account" checked={savingToAccount} onChange={(e) => setSavingToAccount(e.target.checked)} className="mb-3" />

                    <div className="d-flex gap-2">
                      <Button variant="primary" onClick={handleGeneratePDF} disabled={loading || !fsName || !fsAddress || !fsRate || !fsTotal}>
                        {loading ? "Processing..." : "Generate PDF"}
                      </Button>

                      {status === "authenticated" && !savingToAccount && (
                        <Button variant="success" onClick={saveBill} disabled={loading || !fsName || !fsAddress || !fsRate || !fsTotal}>
                          {editMode ? "Update Bill" : "Save to Account"}
                        </Button>
                      )}
                    </div>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>

          <Col md={6}>
            <div className="preview-area card">
              <div className="card-header">
                <h5 className="card-title m-0">Preview</h5>
              </div>
              <div className="card-body" id="previewArea" data-preview-id={`preview-${Date.now()}`}>
                <div className="preview-watermark">PREVIEW</div>
                <SelectedTemplateComponent
                  fsName={fsName}
                  fsAddress={fsAddress}
                  fsTel={fsTel}
                  fsRate={fsRate}
                  fsTotal={fsTotal}
                  fsVolume={fsVolume}
                  csName={csName}
                  csTel={csTel}
                  vehNumber={vehNumber}
                  vehType={vehType}
                  paymentType={paymentType}
                  selectedTaxOption={selectedTaxOption}
                  taxNumber={taxNumber}
                  fsDate={fsDate}
                  fsTime={fsTime}
                  invoiceNumber={invoiceNumber}
                  logo={selectedLogo}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
