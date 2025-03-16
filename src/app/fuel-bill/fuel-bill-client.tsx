"use client";

import { useState, useEffect } from "react";
import { Fuel } from "lucide-react";
import moment from "moment";
import "react-datetime/css/react-datetime.css";
import GenericBill from "@/components/common/GenericBill";
import LiveEditor from "@/components/fuel/LiveEditor";
import TemplateSelector from "@/components/fuel/TemplateSelector";
import FuelTemplate1 from "@/fuel/template1";
import FuelTemplate2 from "@/fuel/template2";
import { required, minValue } from "@/utils/formValidation";

// Import logos
import hpLogo from "@/assets/img/fuel/HP-grayscale.png";
import ioLogo from "@/assets/img/fuel/oil-grayscale.png";
import bpLogo from "@/assets/img/fuel/Bharat-grayscale.png";
import eoLogo from "@/assets/img/fuel/Essar-grayscale.png";

export default function FuelBillClient() {
  // Initial data for the fuel bill
  const [initialData] = useState({
    selectedTemplate: "template1",
    selectedBrand: "bp",
    fsName: "",
    fsAddress: "",
    fsTel: "",
    fsRate: 0,
    fsTotal: 0,
    fsVolume: 0,
    csName: "Not Entered",
    csTel: "Not Entered",
    vehNumber: "Not Entered",
    vehType: "Not Entered",
    paymentType: "",
    selectedTaxOption: "none",
    taxNumber: "",
    fsDate: moment().format("DD/MM/YYYY"),
    fsTime: moment().format("hh:mm"),
    invoiceNumber: moment().format("DDMMYYYY") + moment().format("hhmm"),
  });

  // Validate form function for GenericBill
  const validateFuelForm = (data: any) => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Required fields
    const fields = [
      { key: "fsName", label: "Fuel station name" },
      { key: "fsAddress", label: "Fuel station address" },
      { key: "fsRate", label: "Rate" },
      { key: "fsTotal", label: "Total amount" },
      { key: "fsDate", label: "Date" },
      { key: "fsTime", label: "Time" },
    ];

    // Validate each field
    fields.forEach(({ key, label }) => {
      const error = required(label)(data[key] || "");
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });

    // Validate numeric fields
    if (data.fsRate !== undefined && data.fsRate <= 0) {
      errors.fsRate = "Rate must be greater than 0";
      isValid = false;
    }

    if (data.fsTotal !== undefined && data.fsTotal <= 0) {
      errors.fsTotal = "Total must be greater than 0";
      isValid = false;
    }

    return { isValid, errors };
  };

  // Format bill data for API
  const formatFuelDataForAPI = (data: any, name: string) => {
    console.log("Formatting fuel bill data for API:", data);
    return {
      name: name,
      billType: "fuel",
      template: data.selectedTemplate,
      brand: data.selectedBrand,
      fsName: data.fsName,
      fsAddress: data.fsAddress,
      fsTel: data.fsTel,
      fsRate: data.fsRate,
      fsTotal: data.fsTotal,
      fsVolume: data.fsVolume,
      fsDate: data.fsDate,
      fsTime: data.fsTime,
      csName: data.csName,
      csTel: data.csTel,
      vehNumber: data.vehNumber,
      vehType: data.vehType,
      paymentType: data.paymentType,
      invoiceNumber: data.invoiceNumber,
      taxOption: data.selectedTaxOption,
      taxNumber: data.taxNumber,
    };
  };

  // Parse bill data from API
  const parseFuelDataFromAPI = (data: any) => {
    console.log("Parsing fuel bill data from API:", data);
    return {
      selectedTemplate: data.template || "template1",
      selectedBrand: data.brand || "bp",
      fsName: data.fsName || "",
      fsAddress: data.fsAddress || "",
      fsTel: data.fsTel || "",
      fsRate: data.fsRate || 0,
      fsTotal: data.fsTotal || 0,
      fsVolume: data.fsVolume || 0,
      csName: data.csName || "Not Entered",
      csTel: data.csTel || "Not Entered",
      vehNumber: data.vehNumber || "Not Entered",
      vehType: data.vehType || "Not Entered",
      paymentType: data.paymentType || "",
      selectedTaxOption: data.taxOption || "none",
      taxNumber: data.taxNumber || "",
      fsDate: data.fsDate || moment().format("DD/MM/YYYY"),
      fsTime: data.fsTime || moment().format("hh:mm"),
      invoiceNumber: data.invoiceNumber || moment().format("DDMMYYYY") + moment().format("hhmm"),
    };
  };

  // Generate file name for PDF
  const generateFuelFileName = (data: any) => {
    return `FuelBill_${data.invoiceNumber || moment().format("DDMMYYYY")}.pdf`;
  };

  // Handle data change with volume calculation
  const handleFuelDataChange = (newData: any, onDataChange: (data: any) => void) => {
    // Create a copy of the current data with the new field value
    const updatedData = { ...newData };

    // Calculate volume when rate or total changes
    if (updatedData.fsRate !== undefined && updatedData.fsTotal !== undefined) {
      const voldivide = updatedData.fsTotal / updatedData.fsRate;
      updatedData.fsVolume = updatedData.fsRate !== 0 ? parseFloat(voldivide.toFixed(2)) : 0;
    }

    // Generate a new invoice number whenever fsDate or fsTime changes
    if ((updatedData.fsDate !== undefined || updatedData.fsTime !== undefined) && !updatedData.invoiceNumberManuallySet) {
      const newInvoiceDate = moment(updatedData.fsDate, "DD/MM/YYYY").format("DDMMYYYY");
      const newInvoiceTime = (updatedData.fsTime || "").replace(":", "");
      updatedData.invoiceNumber = newInvoiceDate + newInvoiceTime;
    }

    // Pass the updated data to the parent component
    onDataChange(updatedData);
  };

  // Render template selector
  const renderTemplateSelector = ({ selectedTemplate, onSelectTemplate }: { selectedTemplate: string | number; onSelectTemplate: (template: string | number) => void }) => {
    return <TemplateSelector selectedTemplate={selectedTemplate as string} onSelectTemplate={(template) => onSelectTemplate(template)} />;
  };

  // Render editor
  const renderEditor = ({ data, onDataChange, fieldErrors, handleBlur }: { data: any; onDataChange: (data: any) => void; fieldErrors: Record<string, string>; handleBlur: (field: string, value: any) => void }) => {
    return (
      <LiveEditor
        fuelData={{
          ...data,
          fieldErrors,
          handleBlur,
        }}
        onDataChange={(field, value) => {
          // Create a copy of the current data
          const updatedData = { ...data };

          // Update the specific field
          updatedData[field] = value;

          // Handle special calculations and updates
          handleFuelDataChange(updatedData, onDataChange);
        }}
      />
    );
  };

  // Render preview
  const renderPreview = ({ data, selectedTemplate }: { previewId: string; data: any; selectedTemplate: string | number }) => {
    // Get the appropriate logo based on the selected brand
    let selectedLogo;
    switch (data.selectedBrand) {
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

    // Render the appropriate template
    const TemplateComponent = selectedTemplate === "template1" ? FuelTemplate1 : FuelTemplate2;

    return (
      <TemplateComponent
        fsName={data.fsName || ""}
        fsAddress={data.fsAddress || ""}
        fsTel={data.fsTel || ""}
        fsRate={data.fsRate || 0}
        fsTotal={data.fsTotal || 0}
        fsVolume={data.fsVolume || 0}
        fsDate={data.fsDate || ""}
        fsTime={data.fsTime || ""}
        csName={data.csName || "Not Entered"}
        csTel={data.csTel || "Not Entered"}
        vehNumber={data.vehNumber || "Not Entered"}
        vehType={data.vehType || "Not Entered"}
        paymentType={data.paymentType || ""}
        invoiceNumber={data.invoiceNumber || ""}
        selectedTaxOption={data.selectedTaxOption || "none"}
        taxNumber={data.taxNumber || ""}
        logo={selectedLogo}
      />
    );
  };

  return (
    <GenericBill
      billType="fuel"
      icon={<Fuel size={24} />}
      title="Fuel Bill Generator"
      subtitle="Create professional fuel bills with automatic calculations"
      renderTemplateSelector={renderTemplateSelector}
      renderEditor={renderEditor}
      renderPreview={renderPreview}
      validateForm={validateFuelForm}
      formatBillDataForAPI={formatFuelDataForAPI}
      parseBillDataFromAPI={parseFuelDataFromAPI}
      generateFileName={generateFuelFileName}
      initialData={initialData}
    />
  );
}
