import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Tab, Nav } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import { generatePDF, checkCredits, updateCredits } from "@/utils/billGeneration";

interface GenericBillProps {
  billType: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;

  // Render props for components
  renderTemplateSelector: (props: { selectedTemplate: string | number; onSelectTemplate: (template: string | number) => void }) => React.ReactNode;

  renderEditor: (props: { data: any; onDataChange: (data: any) => void; fieldErrors: Record<string, string>; handleBlur: (field: string, value: any) => void }) => React.ReactNode;

  renderPreview: (props: { previewId: string; data: any; selectedTemplate: string | number }) => React.ReactNode;

  // Functions to handle bill-specific logic
  validateForm: (data: any) => { isValid: boolean; errors: Record<string, string> };
  formatBillDataForAPI: (data: any, name: string) => any;
  parseBillDataFromAPI: (data: any) => any;
  generateFileName: (data: any) => string;

  // Initial data for the bill
  initialData?: any;
}

const GenericBill: React.FC<GenericBillProps> = ({ billType, icon, title, subtitle, renderTemplateSelector, renderEditor, renderPreview, validateForm, formatBillDataForAPI, parseBillDataFromAPI, generateFileName, initialData }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit");

  // Common state
  const [billData, setBillData] = useState<any>(initialData || {});
  const [selectedTemplate, setSelectedTemplate] = useState<string | number>(initialData?.selectedTemplate || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savingToAccount, setSavingToAccount] = useState(false);
  const [billName, setBillName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [validated, setValidated] = useState(false);

  // Generate a unique preview ID
  const previewId = `preview-${Date.now()}`;

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

          // Parse the bill data specific to this bill type
          const parsedData = parseBillDataFromAPI(data.bill);
          setBillData(parsedData);
          setBillName(data.bill.name || "");
          setSavingToAccount(true);
          setSelectedTemplate(data.bill.templateId || 1);
        } catch (error) {
          console.error(`Error fetching ${billType}:`, error);
          setError(`Failed to load the ${billType} for editing`);
        } finally {
          setLoading(false);
        }
      };

      fetchBill();
    }
  }, [editMode, billType, parseBillDataFromAPI]);

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

  // Handle bill data change
  const handleBillDataChange = (data: Partial<typeof billData>) => {
    setBillData((prev: any) => ({
      ...prev,
      ...data,
    }));
  };

  // Validate individual field
  const validateField = (field: string, value: any) => {
    // Bill-specific validation through the validateForm prop
    const { errors } = validateForm({ ...billData, [field]: value });

    // Only set the error for this field
    if (errors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: errors[field],
      }));
      return false;
    } else {
      // Clear the error if it was resolved
      setFieldErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
      return true;
    }
  };

  // Handle field blur
  const handleBlur = (field: string, value: any) => {
    validateField(field, value);
  };

  // Validate form before generating PDF
  const validateEntireForm = () => {
    const { isValid, errors } = validateForm(billData);

    if (!isValid) {
      setFieldErrors(errors);
      setError("Please fill in all required fields");
      setValidated(true);
      return false;
    }

    setError("");
    return true;
  };

  // Generate PDF
  const handleGeneratePDF = async () => {
    if (!validateEntireForm()) {
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

    try {
      setLoading(true);

      // Generate the PDF
      await generatePDF({
        elementId: "billPreview",
        fileName: generateFileName(billData),
        successCallback: async () => {
          try {
            // Update credits
            await updateCredits(status);

            // Save bill if needed
            if (savingToAccount && status === "authenticated") {
              await saveBill();
            }
          } catch (error) {
            console.error("Error after PDF generation:", error);
          }
        },
        errorCallback: (error) => {
          console.error(`Error generating ${billType}:`, error);
          setError(`Failed to generate ${billType}. Please try again.`);
        },
      });
    } catch (error) {
      console.error(`Error in PDF generation:`, error);
      setError(`Failed to generate ${billType}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Save bill to user account
  const saveBill = async () => {
    if (!validateEntireForm()) {
      return;
    }

    if (status !== "authenticated") {
      setError("You must be logged in to save bills to your account.");
      return;
    }

    try {
      setLoading(true);
      setSavingToAccount(true);

      // Format the bill data
      const formattedData = formatBillDataForAPI(billData, billName || `${billType.charAt(0).toUpperCase() + billType.slice(1)} - ${new Date().toISOString().split("T")[0]}`);

      const url = editMode ? `/api/bills/${editMode}` : "/api/bills";
      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billType: billType,
          ...formattedData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to save ${billType}`);
      }

      setSuccess(editMode ? `${billType} updated successfully!` : `${billType} saved to your account successfully!`);

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
      console.error(`Error saving ${billType}:`, error);
      setError((error as Error).message || `Failed to save ${billType} to your account`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title={title} subtitle={subtitle} icon={icon} buttonText="View All Tools" buttonLink="/tools" />
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

        {/* Template Selector */}
        {renderTemplateSelector({
          selectedTemplate,
          onSelectTemplate: setSelectedTemplate,
        })}

        <Row>
          <Col md={6}>
            <Tab.Container defaultActiveKey="editor">
              <Nav variant="tabs" className="">
                <Nav.Item>
                  <Nav.Link eventKey="editor">Edit {billType}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="account">Account Settings</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="editor">
                  {renderEditor({
                    data: billData,
                    onDataChange: handleBillDataChange,
                    fieldErrors,
                    handleBlur,
                  })}
                </Tab.Pane>
                <Tab.Pane eventKey="account">
                  <div className="card card-body">
                    <Form.Group className="mb-3">
                      <Form.Label>{billType} Name (for saving to your account)</Form.Label>
                      <Form.Control type="text" value={billName} onChange={(e) => setBillName(e.target.value)} placeholder={`${billType.charAt(0).toUpperCase() + billType.slice(1)} - ${new Date().toISOString().split("T")[0]}`} />
                    </Form.Group>

                    <Form.Check type="checkbox" id="saveToAccount" label="Save to my account" checked={savingToAccount} onChange={(e) => setSavingToAccount(e.target.checked)} className="mb-3" />

                    <div className="d-flex gap-2">
                      <Button variant="primary" onClick={handleGeneratePDF} disabled={loading}>
                        {loading ? "Processing..." : `Generate ${billType}`}
                      </Button>

                      {status === "authenticated" && !savingToAccount && (
                        <Button variant="success" onClick={saveBill} disabled={loading}>
                          {editMode ? `Update ${billType}` : "Save to Account"}
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
              <div className="card-body" id="billPreview" data-preview-id={previewId}>
                <div className="preview-watermark">PREVIEW</div>
                {renderPreview({
                  previewId,
                  data: billData,
                  selectedTemplate,
                })}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GenericBill;
