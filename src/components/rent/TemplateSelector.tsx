import React from "react";
import { Card, Row, Col } from "react-bootstrap";

interface TemplateSelectorProps {
  selectedTemplate: number;
  onSelectTemplate: (templateId: number) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onSelectTemplate }) => {
  const templates = [
    { id: 1, name: "Classic", description: "Simple and traditional receipt format" },
    { id: 2, name: "Modern", description: "Clean tabular layout with organized sections" },
  ];

  return (
    <div className="template-selector mb-4">
      <h5 className="mb-3">Select Template</h5>
      <Row>
        {templates.map((template) => (
          <Col key={template.id} xs={12} md={6} className="mb-3">
            <Card
              className={`template-card ${selectedTemplate === template.id ? "selected" : ""}`}
              onClick={() => onSelectTemplate(template.id)}
              style={{
                cursor: "pointer",
                border: selectedTemplate === template.id ? "2px solid #007bff" : "1px solid #dee2e6",
              }}
            >
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div
                    className="template-radio me-3"
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: "2px solid #007bff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selectedTemplate === template.id && (
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: "#007bff",
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <h6 className="mb-1">{template.name}</h6>
                    <p className="mb-0 text-muted small">{template.description}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TemplateSelector;
