import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import Datetime from "react-datetime";
import moment from "moment";

interface FuelBillProps {
  selectedTemplate: string;
  selectedBrand: string;
  fsName: string;
  fsAddress: string;
  fsTel: string;
  fsRate: number;
  fsTotal: number;
  fsVolume: number;
  csName: string;
  csTel: string;
  vehNumber: string;
  vehType: string;
  paymentType: string;
  selectedTaxOption: string;
  taxNumber: string;
  fsDate: string;
  fsTime: string;
  invoiceNumber: string;
  fieldErrors: Record<string, string>;
  handleBlur: (field: string, value: any) => void;
}

interface LiveEditorProps {
  fuelData: FuelBillProps;
  onDataChange: (field: string, value: any) => void;
}

const LiveEditor: React.FC<LiveEditorProps> = ({ fuelData, onDataChange }) => {
  const handleChange = (field: string, value: any) => {
    onDataChange(field, value);
  };

  // Helper function to determine if a field is required
  const isRequired = (field: string): boolean => {
    const requiredFields = ["selectedTemplate", "selectedBrand", "fsName", "fsAddress", "fsRate", "fsTotal"];
    return requiredFields.includes(field);
  };

  return (
    <div className="live-editor-canvas">
      <div className="editor-section">
        <h5 className="section-title mb-3">Bill Settings</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Brand <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select value={fuelData.selectedBrand} onChange={(e) => handleChange("selectedBrand", e.target.value)} onBlur={() => fuelData.handleBlur("brand", fuelData.selectedBrand)} isInvalid={!!fuelData.fieldErrors.brand} required>
                <option value="bp">Bharat Petroleum</option>
                <option value="hp">Hindustan Petroleum</option>
                <option value="io">Indian Oil</option>
                <option value="eo">Essar Oil</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{fuelData.fieldErrors.brand}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Invoice Number</Form.Label>
              <Form.Control type="text" value={fuelData.invoiceNumber} onChange={(e) => handleChange("invoiceNumber", e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Payment Type</Form.Label>
              <Form.Select value={fuelData.paymentType} onChange={(e) => handleChange("paymentType", e.target.value)}>
                <option value="">Select Payment Type</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </div>

      <div className="editor-section">
        <h5 className="section-title mb-3">Fuel Station Details</h5>
        <Form.Group className="mb-3">
          <Form.Label>
            Fuel Station Name <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            value={fuelData.fsName}
            onChange={(e) => handleChange("fsName", e.target.value)}
            onBlur={() => fuelData.handleBlur("fsName", fuelData.fsName)}
            placeholder="Enter Fuel Station Name"
            isInvalid={!!fuelData.fieldErrors.fsName}
            required
          />
          <Form.Control.Feedback type="invalid">{fuelData.fieldErrors.fsName}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            Fuel Station Address <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            value={fuelData.fsAddress}
            onChange={(e) => handleChange("fsAddress", e.target.value)}
            onBlur={() => fuelData.handleBlur("fsAddress", fuelData.fsAddress)}
            placeholder="Enter Fuel Station Address"
            isInvalid={!!fuelData.fieldErrors.fsAddress}
            required
          />
          <Form.Control.Feedback type="invalid">{fuelData.fieldErrors.fsAddress}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fuel Station Tel</Form.Label>
          <Form.Control type="text" value={fuelData.fsTel} onChange={(e) => handleChange("fsTel", e.target.value)} placeholder="Enter Fuel Station Tel" />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Date <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={fuelData.fsDate}
                onChange={(e) => handleChange("fsDate", e.target.value)}
                placeholder="DD/MM/YYYY"
                onBlur={() => fuelData.handleBlur("fsDate", fuelData.fsDate)}
                isInvalid={!!fuelData.fieldErrors.fsDate}
                required
              />
              <Form.Control.Feedback type="invalid">{fuelData.fieldErrors.fsDate}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Time <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={fuelData.fsTime}
                onChange={(e) => handleChange("fsTime", e.target.value)}
                placeholder="HH:MM"
                onBlur={() => fuelData.handleBlur("fsTime", fuelData.fsTime)}
                isInvalid={!!fuelData.fieldErrors.fsTime}
                required
              />
              <Form.Control.Feedback type="invalid">{fuelData.fieldErrors.fsTime}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </div>

      <div className="editor-section ">
        <h5 className="section-title mb-3">Pricing Details</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Rate/Ltr (₹) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                value={fuelData.fsRate}
                onChange={(e) => handleChange("fsRate", parseFloat(e.target.value) || 0)}
                onBlur={() => fuelData.handleBlur("fsRate", fuelData.fsRate)}
                placeholder="Enter Rate"
                isInvalid={!!fuelData.fieldErrors.fsRate}
                required
                min="0.01"
                step="0.01"
              />
              <Form.Control.Feedback type="invalid">{fuelData.fieldErrors.fsRate}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Total Fuel Amount (₹) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                value={fuelData.fsTotal}
                onChange={(e) => handleChange("fsTotal", parseFloat(e.target.value) || 0)}
                onBlur={() => fuelData.handleBlur("fsTotal", fuelData.fsTotal)}
                placeholder="Enter Total"
                isInvalid={!!fuelData.fieldErrors.fsTotal}
                required
                min="0.01"
                step="0.01"
              />
              <Form.Control.Feedback type="invalid">{fuelData.fieldErrors.fsTotal}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Volume (Liters)</Form.Label>
              <Form.Control type="number" value={fuelData.fsVolume} readOnly placeholder="Auto-calculated" />
              <Form.Text className="text-muted">Auto-calculated from rate and total</Form.Text>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Tax Option</Form.Label>
              <Form.Select value={fuelData.selectedTaxOption} onChange={(e) => handleChange("selectedTaxOption", e.target.value)}>
                <option value="none">None</option>
                <option value="gst">GST</option>
                <option value="vat">VAT</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        {fuelData.selectedTaxOption !== "none" && (
          <Form.Group className="mb-3">
            <Form.Label>Tax Number</Form.Label>
            <Form.Control type="text" value={fuelData.taxNumber} onChange={(e) => handleChange("taxNumber", e.target.value)} placeholder={`Enter ${fuelData.selectedTaxOption.toUpperCase()} Number`} />
          </Form.Group>
        )}
      </div>

      <div className="editor-section">
        <h5 className="section-title mb-3">Customer Details</h5>
        <Form.Group className="mb-3">
          <Form.Label>Customer Name</Form.Label>
          <Form.Control type="text" value={fuelData.csName} onChange={(e) => handleChange("csName", e.target.value)} placeholder="Enter Customer Name" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Customer Tel</Form.Label>
          <Form.Control type="text" value={fuelData.csTel} onChange={(e) => handleChange("csTel", e.target.value)} placeholder="Enter Customer Tel" />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Number</Form.Label>
              <Form.Control type="text" value={fuelData.vehNumber} onChange={(e) => handleChange("vehNumber", e.target.value)} placeholder="Enter Vehicle Number" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Type</Form.Label>
              <Form.Control type="text" value={fuelData.vehType} onChange={(e) => handleChange("vehType", e.target.value)} placeholder="Enter Vehicle Type" />
            </Form.Group>
          </Col>
        </Row>
      </div>

      <div className="mt-3">
        <p className="text-muted">
          <span className="text-danger">*</span> Required fields
        </p>
      </div>
    </div>
  );
};

export default LiveEditor;
