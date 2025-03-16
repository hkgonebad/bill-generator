import { ReactNode } from "react";
import templateRegistry, { BillType } from "@/templates/registry";
import RentTemplate1 from "./template1";
import RentTemplate2 from "./template2";

// Register rent receipt templates
export const registerRentTemplates = () => {
  // Template 1
  templateRegistry.registerTemplate({
    id: "template1",
    name: "Standard Rent Receipt",
    description: "A clean, professional rent receipt template",
    billType: BillType.RENT,
    render: function (props) {
      // This will be called in a React component context
      return RentTemplate1(props);
    },
  });

  // Template 2
  templateRegistry.registerTemplate({
    id: "template2",
    name: "Detailed Rent Receipt",
    description: "A detailed rent receipt with additional information",
    billType: BillType.RENT,
    render: function (props) {
      // This will be called in a React component context
      return RentTemplate2(props);
    },
  });
};

// Helper function to render a rent receipt template
export const renderRentTemplate = (templateId: string, props: any): ReactNode => {
  return templateRegistry.renderTemplate(templateId, BillType.RENT, props);
};

// Export a function to get all rent templates
export const getRentTemplates = () => {
  return templateRegistry.getTemplatesByType(BillType.RENT);
};

// Initialize templates
registerRentTemplates();
