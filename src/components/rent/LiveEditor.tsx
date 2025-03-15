import React from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { RentReceiptProps } from "./Template1";

interface LiveEditorProps {
  receiptData: RentReceiptProps;
  onDataChange: (data: Partial<RentReceiptProps>) => void;
}

const LiveEditor: React.FC<LiveEditorProps> = ({ receiptData, onDataChange }) => {
  const handleChange = (field: string, value: string | number) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      if (parent === "rentPeriod") {
        onDataChange({
          rentPeriod: {
            ...receiptData.rentPeriod,
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

  return (
    <div className="live-editor-canvas">
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Receipt Details</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Receipt Number</Form.Label>
                <Form.Control type="text" value={receiptData.receiptNumber} onChange={(e) => handleChange("receiptNumber", e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Payment Date</Form.Label>
                <Form.Control type="date" value={receiptData.paymentDate} onChange={(e) => handleChange("paymentDate", e.target.value)} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Rent Amount (₹)</Form.Label>
                <Form.Control type="number" value={receiptData.rentAmount} onChange={(e) => handleChange("rentAmount", parseFloat(e.target.value) || 0)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Payment Mode</Form.Label>
                <Form.Select value={receiptData.paymentMode} onChange={(e) => handleChange("paymentMode", e.target.value)}>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="Cheque">Cheque</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Rent Period From</Form.Label>
                <Form.Control type="date" value={receiptData.rentPeriod.from} onChange={(e) => handleChange("rentPeriod.from", e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Rent Period To</Form.Label>
                <Form.Control type="date" value={receiptData.rentPeriod.to} onChange={(e) => handleChange("rentPeriod.to", e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Landlord Details</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Landlord Name</Form.Label>
            <Form.Control type="text" value={receiptData.landlordName} onChange={(e) => handleChange("landlordName", e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Landlord Address</Form.Label>
            <Form.Control as="textarea" rows={2} value={receiptData.landlordAddress} onChange={(e) => handleChange("landlordAddress", e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>PAN Number (Optional)</Form.Label>
            <Form.Control type="text" value={receiptData.panNumber || ""} onChange={(e) => handleChange("panNumber", e.target.value)} />
          </Form.Group>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Tenant Details</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tenant Name</Form.Label>
            <Form.Control type="text" value={receiptData.tenantName} onChange={(e) => handleChange("tenantName", e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tenant Address</Form.Label>
            <Form.Control as="textarea" rows={2} value={receiptData.tenantAddress} onChange={(e) => handleChange("tenantAddress", e.target.value)} />
          </Form.Group>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LiveEditor;
