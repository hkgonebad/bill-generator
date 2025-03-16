import mongoose from "mongoose";

const BillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    billType: {
      type: String,
      required: true,
      enum: ["fuel", "rent", "other"],
    },
    name: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create more specific schemas for different bill types
const FuelBillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    template: {
      type: String,
      required: true,
      enum: ["template1", "template2"],
    },
    brand: {
      type: String,
      required: true,
    },
    fsName: {
      type: String,
      required: true,
    },
    fsAddress: {
      type: String,
      required: true,
    },
    fsTel: String,
    fsRate: {
      type: Number,
      required: true,
    },
    fsTotal: {
      type: Number,
      required: true,
    },
    fsVolume: {
      type: Number,
      required: true,
    },
    fsDate: {
      type: String,
      required: true,
    },
    fsTime: {
      type: String,
      required: true,
    },
    csName: String,
    vehNumber: String,
    vehType: String,
    paymentType: String,
    invoiceNumber: String,
    taxOption: String,
    taxNumber: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const RentReceiptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    landlordName: {
      type: String,
      required: true,
    },
    tenantName: {
      type: String,
      required: true,
    },
    rentAmount: {
      type: Number,
      required: true,
    },
    propertyAddress: {
      type: String,
      required: true,
    },
    periodStart: {
      type: String,
      required: true,
    },
    periodEnd: {
      type: String,
      required: true,
    },
    paymentDate: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    receiptNumber: {
      type: String,
      required: true,
    },
    landlordAddress: {
      type: String,
    },
    panNumber: {
      type: String,
    },
    showPanDetails: {
      type: Boolean,
      default: false,
    },
    templateId: {
      type: Number,
      default: 1,
    },
    billType: {
      type: String,
      default: "rent",
      enum: ["rent"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Bill = mongoose.models.Bill || mongoose.model("Bill", BillSchema);
export const FuelBill = mongoose.models.FuelBill || mongoose.model("FuelBill", FuelBillSchema);
export const RentReceipt = mongoose.models.RentReceipt || mongoose.model("RentReceipt", RentReceiptSchema);
