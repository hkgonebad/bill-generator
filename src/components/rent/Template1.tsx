import React from "react";
import moment from "moment";
import { convertNumberToWords } from "@/utils/numberToWords";

export interface RentReceiptProps {
  landlordName: string;
  landlordAddress: string;
  tenantName: string;
  tenantAddress: string;
  rentAmount: number;
  rentAmountInWords: string;
  paymentDate: string;
  paymentMode: string;
  receiptNumber: string;
  panNumber?: string;
  rentPeriod: {
    from: string;
    to: string;
  };
}

const Template1: React.FC<RentReceiptProps> = ({ landlordName, landlordAddress, tenantName, tenantAddress, rentAmount, paymentDate, paymentMode, receiptNumber, panNumber, rentPeriod }) => {
  const formattedPaymentDate = moment(paymentDate).format("DD/MM/YYYY");
  const formattedFromDate = moment(rentPeriod.from).format("DD/MM/YYYY");
  const formattedToDate = moment(rentPeriod.to).format("DD/MM/YYYY");
  const amountInWords = convertNumberToWords(rentAmount);

  return (
    <div className="rent-receipt template1">
      <div className="receipt-header">
        <h2>Rent Receipt</h2>
        <div className="receipt-number">Receipt No: {receiptNumber}</div>
        <div className="receipt-date">Date: {formattedPaymentDate}</div>
      </div>

      <div className="receipt-body">
        <p>
          Received sum of <strong>₹{rentAmount.toLocaleString("en-IN")}</strong> ({amountInWords}) from <strong>{tenantName}</strong> towards the rent of property located at {tenantAddress}
          for the period from {formattedFromDate} to {formattedToDate}.
        </p>

        <p>
          <strong>Payment Mode:</strong> {paymentMode}
        </p>

        {panNumber && (
          <p>
            <strong>PAN:</strong> {panNumber}
          </p>
        )}
      </div>

      <div className="receipt-footer">
        <div className="landlord-details">
          <p>
            <strong>Landlord Details:</strong>
          </p>
          <p>{landlordName}</p>
          <p>{landlordAddress}</p>
        </div>

        <div className="signature">
          <div className="signature-line"></div>
          <p>Signature</p>
        </div>

        <div style={{ clear: "both" }}></div>
      </div>
    </div>
  );
};

export default Template1;
