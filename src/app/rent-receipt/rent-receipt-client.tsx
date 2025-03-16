"use client";

import { useState } from "react";
import moment from "moment";
import { Receipt } from "lucide-react";
import { convertNumberToWords } from "@/utils/numberToWords";
import Template1 from "@/components/rent/Template1";
import Template2 from "@/components/rent/Template2";
import TemplateSelector from "@/components/rent/TemplateSelector";
import LiveEditor from "@/components/rent/LiveEditor";
import GenericBill from "@/components/common/GenericBill";
import { RentReceiptProps } from "@/components/rent/Template1";
import { required, minValue } from "@/utils/formValidation";

export default function RentReceiptClient() {
  // Initialize default receipt data
  const [initialData] = useState({
    landlordName: "",
    landlordAddress: "",
    tenantName: "",
    tenantAddress: "",
    rentAmount: 0,
    rentAmountInWords: "Zero Rupees Only",
    paymentDate: moment().format("YYYY-MM-DD"),
    paymentMode: "Cash",
    receiptNumber: `RENT${moment().format("YYYYMMDD")}${Math.floor(Math.random() * 1000)}`,
    panNumber: "",
    rentPeriod: {
      from: moment().startOf("month").format("YYYY-MM-DD"),
      to: moment().endOf("month").format("YYYY-MM-DD"),
    },
  });

  // Validate form function for GenericBill
  const validateRentForm = (data: any) => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Required fields
    const fields = [
      { key: "landlordName", label: "Landlord name" },
      { key: "tenantName", label: "Tenant name" },
      { key: "tenantAddress", label: "Tenant address" },
      { key: "rentAmount", label: "Rent amount" },
      { key: "paymentDate", label: "Payment date" },
      { key: "receiptNumber", label: "Receipt number" },
    ];

    // Validate each field
    fields.forEach(({ key, label }) => {
      const error = required(label)(data[key] || "");
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });

    // Validate rent amount
    if (data.rentAmount !== undefined && data.rentAmount <= 0) {
      errors.rentAmount = "Rent amount must be greater than 0";
      isValid = false;
    }

    // Validate rent period
    if (data.rentPeriod) {
      if (!data.rentPeriod.from) {
        errors["rentPeriod.from"] = "Period start date is required";
        isValid = false;
      }
      if (!data.rentPeriod.to) {
        errors["rentPeriod.to"] = "Period end date is required";
        isValid = false;
      }
      if (data.rentPeriod.from && data.rentPeriod.to && new Date(data.rentPeriod.from) > new Date(data.rentPeriod.to)) {
        errors["rentPeriod.from"] = "Start date cannot be after end date";
        isValid = false;
      }
    }

    return { isValid, errors };
  };

  // Format bill data for API
  const formatRentDataForAPI = (data: any, name: string) => {
    console.log("Formatting bill data for API:", data);
    return {
      name: name,
      billType: "rent",
      landlordName: data.landlordName,
      landlordAddress: data.landlordAddress,
      tenantName: data.tenantName,
      propertyAddress: data.tenantAddress,
      rentAmount: data.rentAmount,
      periodStart: data.rentPeriod?.from,
      periodEnd: data.rentPeriod?.to,
      paymentDate: data.paymentDate,
      paymentMethod: data.paymentMode,
      receiptNumber: data.receiptNumber || `RENT${moment().format("YYYYMMDD")}${Math.floor(Math.random() * 1000)}`,
      showPanDetails: !!data.panNumber,
      panNumber: data.panNumber || "",
      templateId: data.selectedTemplate || 1,
    };
  };

  // Parse bill data from API
  const parseRentDataFromAPI = (data: any) => {
    console.log("Parsing bill data from API:", data);
    return {
      landlordName: data.landlordName || "",
      landlordAddress: data.landlordAddress || "",
      tenantName: data.tenantName || "",
      tenantAddress: data.propertyAddress || "",
      rentAmount: data.rentAmount || 0,
      rentAmountInWords: convertNumberToWords(data.rentAmount || 0),
      paymentDate: data.paymentDate || moment().format("YYYY-MM-DD"),
      paymentMode: data.paymentMethod || "Cash",
      receiptNumber: data.receiptNumber || `RENT${moment().format("YYYYMMDD")}${Math.floor(Math.random() * 1000)}`,
      panNumber: data.panNumber || "",
      rentPeriod: {
        from: data.periodStart || moment().startOf("month").format("YYYY-MM-DD"),
        to: data.periodEnd || moment().endOf("month").format("YYYY-MM-DD"),
      },
      selectedTemplate: data.templateId || 1,
    };
  };

  // Generate file name for PDF
  const generateRentFileName = (data: any) => {
    return `RentReceipt_${data.receiptNumber || moment().format("YYYYMMDD")}.pdf`;
  };

  // Handle data change with rentAmountInWords update
  const handleRentDataChange = (data: any, onDataChange: (data: any) => void) => {
    // Update rentAmountInWords whenever rentAmount changes
    if (data.rentAmount !== undefined) {
      data.rentAmountInWords = convertNumberToWords(data.rentAmount);
    }
    onDataChange(data);
  };

  // Render template selector
  const renderTemplateSelector = ({ selectedTemplate, onSelectTemplate }: { selectedTemplate: string | number; onSelectTemplate: (template: string | number) => void }) => {
    return <TemplateSelector selectedTemplate={Number(selectedTemplate)} onSelectTemplate={onSelectTemplate} />;
  };

  // Render editor
  const renderEditor = ({ data, onDataChange, fieldErrors, handleBlur }: { data: any; onDataChange: (data: any) => void; fieldErrors: Record<string, string>; handleBlur: (field: string, value: any) => void }) => {
    // Ensure data has the correct shape for LiveEditor
    const editorData = {
      ...data,
      rentPeriod: data.rentPeriod || {
        from: moment().startOf("month").format("YYYY-MM-DD"),
        to: moment().endOf("month").format("YYYY-MM-DD"),
      },
    } as RentReceiptProps;

    return <LiveEditor receiptData={editorData} onDataChange={(newData) => handleRentDataChange(newData, onDataChange)} fieldErrors={fieldErrors} handleBlur={handleBlur} />;
  };

  // Render preview
  const renderPreview = ({ data, selectedTemplate }: { previewId: string; data: any; selectedTemplate: string | number }) => {
    // Ensure data has the correct shape for templates
    const previewData = {
      ...data,
      rentPeriod: data.rentPeriod || {
        from: moment().startOf("month").format("YYYY-MM-DD"),
        to: moment().endOf("month").format("YYYY-MM-DD"),
      },
      rentAmountInWords: data.rentAmountInWords || convertNumberToWords(data.rentAmount || 0),
    } as RentReceiptProps;

    return Number(selectedTemplate) === 1 ? (
      <Template1
        landlordName={previewData.landlordName}
        landlordAddress={previewData.landlordAddress}
        tenantName={previewData.tenantName}
        tenantAddress={previewData.tenantAddress}
        rentAmount={previewData.rentAmount}
        rentAmountInWords={previewData.rentAmountInWords}
        paymentDate={previewData.paymentDate}
        paymentMode={previewData.paymentMode}
        receiptNumber={previewData.receiptNumber}
        panNumber={previewData.panNumber}
        rentPeriod={previewData.rentPeriod}
      />
    ) : (
      <Template2
        landlordName={previewData.landlordName}
        landlordAddress={previewData.landlordAddress}
        tenantName={previewData.tenantName}
        tenantAddress={previewData.tenantAddress}
        rentAmount={previewData.rentAmount}
        rentAmountInWords={previewData.rentAmountInWords}
        paymentDate={previewData.paymentDate}
        paymentMode={previewData.paymentMode}
        receiptNumber={previewData.receiptNumber}
        panNumber={previewData.panNumber}
        rentPeriod={previewData.rentPeriod}
      />
    );
  };

  return (
    <GenericBill
      billType="Rent Reciept"
      icon={<Receipt size={24} />}
      title="Rent Receipt Generator"
      subtitle="Create professional rent receipts for your tenants"
      renderTemplateSelector={renderTemplateSelector}
      renderEditor={renderEditor}
      renderPreview={renderPreview}
      validateForm={validateRentForm}
      formatBillDataForAPI={formatRentDataForAPI}
      parseBillDataFromAPI={parseRentDataFromAPI}
      generateFileName={generateRentFileName}
      initialData={initialData}
    />
  );
}
