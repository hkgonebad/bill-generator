import { ReactNode } from "react";
import templateRegistry, { BillType } from "@/templates/registry";
import FuelTemplate1 from "./template1";
import FuelTemplate2 from "./template2";

// Register fuel bill templates
export const registerFuelTemplates = () => {
  // Template 1
  templateRegistry.registerTemplate({
    id: "template1",
    name: "Standard Fuel Bill",
    description: "A clean, professional fuel bill template",
    billType: BillType.FUEL,
    render: function (props) {
      // This will be called in a React component context
      return FuelTemplate1(props);
    },
  });

  // Template 2
  templateRegistry.registerTemplate({
    id: "template2",
    name: "Detailed Fuel Bill",
    description: "A detailed fuel bill with additional information",
    billType: BillType.FUEL,
    render: function (props) {
      // This will be called in a React component context
      return FuelTemplate2(props);
    },
  });
};

// Helper function to render a fuel bill template
export const renderFuelTemplate = (templateId: string, props: any): ReactNode => {
  return templateRegistry.renderTemplate(templateId, BillType.FUEL, props);
};

// Export a function to get all fuel templates
export const getFuelTemplates = () => {
  return templateRegistry.getTemplatesByType(BillType.FUEL);
};

// Initialize templates
registerFuelTemplates();
