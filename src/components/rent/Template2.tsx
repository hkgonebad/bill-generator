import React from "react";
import moment from "moment";
import { convertNumberToWords } from "@/utils/numberToWords";
import { RentReceiptProps } from "./Template1";

const Template2: React.FC<RentReceiptProps> = ({ landlordName, landlordAddress, tenantName, tenantAddress, rentAmount, paymentDate, paymentMode, receiptNumber, panNumber, rentPeriod }) => {
  const formattedPaymentDate = moment(paymentDate).format("DD MMMM YYYY");
  const formattedFromDate = moment(rentPeriod.from).format("DD MMMM YYYY");
  const formattedToDate = moment(rentPeriod.to).format("DD MMMM YYYY");
  const amountInWords = convertNumberToWords(rentAmount);

  return (
    <div className="rent-receipt template2">
      <div className="receipt-container p-4">
        <div className="receipt-header text-center mb-4">
          <h2 className="mb-3">RENT RECEIPT</h2>
          <div className="d-flex justify-content-between">
            <div>
              Receipt No: <strong>{receiptNumber}</strong>
            </div>
            <div>
              Date: <strong>{formattedPaymentDate}</strong>
            </div>
          </div>
        </div>

        <div className="receipt-body">
          <div className="row mb-3">
            <div className="col-4">Tenant Name</div>
            <div className="col-8">
              <strong>{tenantName}</strong>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-4">Tenant Address</div>
            <div className="col-8">{tenantAddress}</div>
          </div>

          <div className="row mb-3">
            <div className="col-4">Rent Period</div>
            <div className="col-8">
              {formattedFromDate} to {formattedToDate}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-4">Amount</div>
            <div className="col-8">₹{rentAmount.toLocaleString("en-IN")}</div>
          </div>

          <div className="row mb-3">
            <div className="col-4">Amount in Words</div>
            <div className="col-8">{amountInWords}</div>
          </div>

          <div className="row mb-3">
            <div className="col-4">Payment Mode</div>
            <div className="col-8">{paymentMode}</div>
          </div>

          {panNumber && (
            <div className="row mb-3">
              <div className="col-4">PAN Number</div>
              <div className="col-8">{panNumber}</div>
            </div>
          )}
        </div>

        <div className="receipt-footer mt-5">
          <div className="row">
            <div className="col-6">
              <div className="landlord-info">
                <p>
                  <strong>Landlord Details:</strong>
                </p>
                <p>{landlordName}</p>
                <p>{landlordAddress}</p>
              </div>
            </div>
            <div className="col-6 text-center">
              <div className="signature-line mb-2"></div>
              <p>Landlord Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template2;
