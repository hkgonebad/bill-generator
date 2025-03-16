import React from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onSelectTemplate }) => {
  const templates = [
    { id: "template1", name: "Template 1" },
    { id: "template2", name: "Template 2" },
  ];

  return (
    <div className="template-selector mb-4">
      <h5 className="mb-3">Select Template</h5>
      <div className="template-options">
        <ButtonGroup>
          {templates.map((template) => (
            <ToggleButton
              key={template.id}
              id={`template-${template.id}`}
              type="radio"
              variant={selectedTemplate === template.id ? "primary" : "outline-primary"}
              name="template"
              value={template.id}
              checked={selectedTemplate === template.id}
              onChange={(e) => onSelectTemplate(e.currentTarget.value)}
            >
              {template.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>
    </div>
  );
};

export default TemplateSelector;
