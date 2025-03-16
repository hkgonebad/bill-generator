import { ReactNode } from "react";

// Template type definitions
export enum BillType {
  RENT = "rent",
  FUEL = "fuel",
  INVOICE = "invoice", // For future expansion
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  billType: BillType;
  // This function should be implemented by each template
  render: (props: any) => ReactNode;
  // Optional thumbnail image for template selection
  thumbnail?: string;
}

// Template registry to manage all bill templates
class TemplateRegistry {
  private templates: Record<string, TemplateDefinition> = {};

  /**
   * Register a new template
   * @param template Template definition
   */
  registerTemplate(template: TemplateDefinition): void {
    const templateKey = `${template.billType}-${template.id}`;
    this.templates[templateKey] = template;
  }

  /**
   * Get all templates for a specific bill type
   * @param billType Type of bill
   * @returns Array of template definitions
   */
  getTemplatesByType(billType: BillType): TemplateDefinition[] {
    return Object.values(this.templates).filter((template) => template.billType === billType);
  }

  /**
   * Get a specific template by ID and bill type
   * @param templateId Template ID
   * @param billType Type of bill
   * @returns Template definition or undefined if not found
   */
  getTemplate(templateId: string, billType: BillType): TemplateDefinition | undefined {
    const templateKey = `${billType}-${templateId}`;
    return this.templates[templateKey];
  }

  /**
   * Render a specific template with the provided props
   * @param templateId Template ID
   * @param billType Type of bill
   * @param props Props to pass to the template
   * @returns Rendered template or null if template not found
   */
  renderTemplate(templateId: string, billType: BillType, props: any): ReactNode | null {
    const template = this.getTemplate(templateId, billType);
    return template ? template.render(props) : null;
  }
}

// Create and export a singleton instance
export const templateRegistry = new TemplateRegistry();

// Example usage (commented out as this is just for reference)
/*
// Example of how to register a template (this would be done in each template file)
import Template1 from '@/components/rent/Template1';

templateRegistry.registerTemplate({
  id: '1',
  name: 'Classic Receipt',
  description: 'Professional rent receipt with classic layout',
  billType: BillType.RENT,
  render: (props) => <Template1 {...props} />,
  thumbnail: '/images/templates/rent-template1.png',
});

// Example of how to use the registry in a component
const TemplateSelector = ({ selectedTemplate, onSelectTemplate, billType }) => {
  const templates = templateRegistry.getTemplatesByType(billType);
  
  return (
    <div className="template-grid">
      {templates.map((template) => (
        <div 
          key={template.id}
          className={`template-card ${selectedTemplate === template.id ? 'active' : ''}`}
          onClick={() => onSelectTemplate(template.id)}
        >
          <div className="template-thumbnail">
            {template.thumbnail && <img src={template.thumbnail} alt={template.name} />}
          </div>
          <div className="template-details">
            <h4>{template.name}</h4>
            <p>{template.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
*/

export default templateRegistry;
