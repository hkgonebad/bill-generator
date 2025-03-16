import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { RentReceiptProps } from "./Template1";
import moment from "moment";

interface LiveEditorProps {
  receiptData: RentReceiptProps;
  onDataChange: (data: Partial<RentReceiptProps>) => void;
  fieldErrors?: Record<string, string>;
  handleBlur?: (field: string, value: any) => void;
}

const LiveEditor: React.FC<LiveEditorProps> = ({ receiptData, onDataChange, fieldErrors = {}, handleBlur = () => {} }) => {
  // Ensure rentPeriod is always defined
  const rentPeriod = receiptData.rentPeriod || {
    from: moment().startOf("month").format("YYYY-MM-DD"),
    to: moment().endOf("month").format("YYYY-MM-DD"),
  };

  const handleChange = (field: string, value: string | number) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      if (parent === "rentPeriod") {
        onDataChange({
          rentPeriod: {
            ...rentPeriod,
            [child]: value,
          },
        });
      } else {
        onDataChange({ [field]: value });
      }
    } else {
      onDataChange({ [field]: value });
    }
  };

  // Helper function to determine if a field is required
  const isRequired = (field: string): boolean => {
    const requiredFields = ["landlordName", "tenantName", "tenantAddress", "rentAmount", "paymentDate", "rentPeriod.from", "rentPeriod.to"];
    return requiredFields.includes(field);
  };

  return (
    <div className="live-editor-canvas">
      <div className="editor-section">
        <h5 className="section-title mb-3">Receipt Details</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Receipt Number <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={receiptData.receiptNumber || ""}
                onChange={(e) => handleChange("receiptNumber", e.target.value)}
                onBlur={() => handleBlur("receiptNumber", receiptData.receiptNumber)}
                isInvalid={!!fieldErrors.receiptNumber}
                required
              />
              <Form.Control.Feedback type="invalid">{fieldErrors.receiptNumber}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Payment Date <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                value={receiptData.paymentDate || ""}
                onChange={(e) => handleChange("paymentDate", e.target.value)}
                onBlur={() => handleBlur("paymentDate", receiptData.paymentDate)}
                isInvalid={!!fieldErrors.paymentDate}
                required
              />
              <Form.Control.Feedback type="invalid">{fieldErrors.paymentDate}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Rent Amount (₹) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                value={receiptData.rentAmount || 0}
                onChange={(e) => handleChange("rentAmount", parseFloat(e.target.value) || 0)}
                onBlur={() => handleBlur("rentAmount", receiptData.rentAmount)}
                isInvalid={!!fieldErrors.rentAmount}
                required
                min="0.01"
                step="0.01"
              />
              <Form.Control.Feedback type="invalid">{fieldErrors.rentAmount}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Payment Mode <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                value={receiptData.paymentMode || "Cash"}
                onChange={(e) => handleChange("paymentMode", e.target.value)}
                onBlur={() => handleBlur("paymentMode", receiptData.paymentMode)}
                isInvalid={!!fieldErrors.paymentMode}
                required
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{fieldErrors.paymentMode}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Rent Period From <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                value={rentPeriod.from}
                onChange={(e) => handleChange("rentPeriod.from", e.target.value)}
                onBlur={() => handleBlur("rentPeriod.from", rentPeriod.from)}
                isInvalid={!!fieldErrors["rentPeriod.from"]}
                required
              />
              <Form.Control.Feedback type="invalid">{fieldErrors["rentPeriod.from"]}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Rent Period To <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control type="date" value={rentPeriod.to} onChange={(e) => handleChange("rentPeriod.to", e.target.value)} onBlur={() => handleBlur("rentPeriod.to", rentPeriod.to)} isInvalid={!!fieldErrors["rentPeriod.to"]} required />
              <Form.Control.Feedback type="invalid">{fieldErrors["rentPeriod.to"]}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </div>

      <div className="editor-section">
        <h5 className="section-title mb-3">Landlord Details</h5>
        <Form.Group className="mb-3">
          <Form.Label>
            Landlord Name <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            value={receiptData.landlordName || ""}
            onChange={(e) => handleChange("landlordName", e.target.value)}
            onBlur={() => handleBlur("landlordName", receiptData.landlordName)}
            isInvalid={!!fieldErrors.landlordName}
            required
          />
          <Form.Control.Feedback type="invalid">{fieldErrors.landlordName}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Landlord Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={receiptData.landlordAddress || ""}
            onChange={(e) => handleChange("landlordAddress", e.target.value)}
            onBlur={() => handleBlur("landlordAddress", receiptData.landlordAddress)}
            isInvalid={!!fieldErrors.landlordAddress}
          />
          <Form.Control.Feedback type="invalid">{fieldErrors.landlordAddress}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>PAN Number (Optional)</Form.Label>
          <Form.Control type="text" value={receiptData.panNumber || ""} onChange={(e) => handleChange("panNumber", e.target.value)} />
        </Form.Group>
      </div>

      <div className="editor-section">
        <h5 className="section-title mb-3">Tenant Details</h5>
        <Form.Group className="mb-3">
          <Form.Label>
            Tenant Name <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            value={receiptData.tenantName || ""}
            onChange={(e) => handleChange("tenantName", e.target.value)}
            onBlur={() => handleBlur("tenantName", receiptData.tenantName)}
            isInvalid={!!fieldErrors.tenantName}
            required
          />
          <Form.Control.Feedback type="invalid">{fieldErrors.tenantName}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            Tenant Address <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={receiptData.tenantAddress || ""}
            onChange={(e) => handleChange("tenantAddress", e.target.value)}
            onBlur={() => handleBlur("tenantAddress", receiptData.tenantAddress)}
            isInvalid={!!fieldErrors.tenantAddress}
            required
          />
          <Form.Control.Feedback type="invalid">{fieldErrors.tenantAddress}</Form.Control.Feedback>
        </Form.Group>
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
