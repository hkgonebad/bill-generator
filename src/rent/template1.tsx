import React from "react";
import moment from "moment";

interface RentReceiptProps {
  landlordName: string;
  landlordAddress: string;
  tenantName: string;
  propertyAddress: string;
  rentAmount: number;
  periodStart: string;
  periodEnd: string;
  paymentDate: string;
  paymentMethod: string;
  receiptNumber: string;
  showPanDetails: boolean;
  panNumber: string;
}

const RentTemplate1: React.FC<RentReceiptProps> = ({ landlordName, landlordAddress, tenantName, propertyAddress, rentAmount, periodStart, periodEnd, paymentDate, paymentMethod, receiptNumber, showPanDetails, panNumber }) => {
  // Format dates
  const formattedPeriodStart = moment(periodStart).format("DD/MM/YYYY");
  const formattedPeriodEnd = moment(periodEnd).format("DD/MM/YYYY");
  const formattedPaymentDate = moment(paymentDate).format("DD/MM/YYYY");

  // Format amount
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rentAmount);

  // Convert amount to words
  const amountInWords = (amount: number) => {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const numToWord = (num: number): string => {
      if (num < 20) return ones[num];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "");
      if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " and " + numToWord(num % 100) : "");
      if (num < 100000) return numToWord(Math.floor(num / 1000)) + " Thousand" + (num % 1000 !== 0 ? " " + numToWord(num % 1000) : "");
      if (num < 10000000) return numToWord(Math.floor(num / 100000)) + " Lakh" + (num % 100000 !== 0 ? " " + numToWord(num % 100000) : "");
      return numToWord(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 !== 0 ? " " + numToWord(num % 10000000) : "");
    };

    return numToWord(amount) + " Rupees Only";
  };

  return (
    <div className="rent-receipt template1" id="receiptPreview">
      <div className="receipt-header">
        <h2 className="text-center mb-4">RENT RECEIPT</h2>
        <div className="receipt-number">
          <strong>Receipt No:</strong> {receiptNumber}
        </div>
        <div className="receipt-date">
          <strong>Date:</strong> {formattedPaymentDate}
        </div>
      </div>

      <div className="receipt-body mt-4">
        <p>
          Received sum of <strong>{formattedAmount}</strong> ({amountInWords(rentAmount)}) from <strong>{tenantName}</strong> towards the rent of property located at <strong>{propertyAddress}</strong> for the period from{" "}
          <strong>{formattedPeriodStart}</strong> to <strong>{formattedPeriodEnd}</strong>.
        </p>

        <div className="payment-details mt-4">
          <p>
            <strong>Payment Mode:</strong> {paymentMethod}
          </p>
        </div>

        {showPanDetails && panNumber && (
          <div className="pan-details mt-3">
            <p>
              <strong>PAN:</strong> {panNumber}
            </p>
          </div>
        )}
      </div>

      <div className="receipt-footer mt-5">
        <div className="landlord-details">
          <p>
            <strong>Landlord Details:</strong>
          </p>
          <p>{landlordName}</p>
          <p>{landlordAddress}</p>
        </div>
        <div className="signature mt-5 text-end">
          <div className="signature-line"></div>
          <p>Signature</p>
        </div>
      </div>
    </div>
  );
};

export default RentTemplate1;
