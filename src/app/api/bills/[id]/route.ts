import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { Bill, FuelBill, RentReceipt } from "@/models/Bill";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    // Connect to the database
    await dbConnect();

    // Check authentication
    const session = await getServerSession(authOptions as any);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Try to find the bill in each collection
    let bill = await FuelBill.findOne({ _id: id, userId });

    if (!bill) {
      bill = await RentReceipt.findOne({ _id: id, userId });
    }

    if (!bill) {
      bill = await Bill.findOne({ _id: id, userId });
    }

    if (!bill) {
      return NextResponse.json({ message: "Bill not found" }, { status: 404 });
    }

    return NextResponse.json({ bill });
  } catch (error) {
    console.error("Error fetching bill:", error);
    return NextResponse.json({ message: "Internal server error", error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    // Connect to the database
    await dbConnect();

    // Check authentication
    const session = await getServerSession(authOptions as any);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const billData = await request.json();

    // Determine bill type and update in the appropriate collection
    if (billData.billType === "fuel") {
      const bill = await FuelBill.findOneAndUpdate({ _id: id, userId }, billData, { new: true, runValidators: true });

      if (!bill) {
        return NextResponse.json({ message: "Bill not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "Bill updated successfully", bill });
    } else if (billData.billType === "rent") {
      const bill = await RentReceipt.findOneAndUpdate({ _id: id, userId }, billData, { new: true, runValidators: true });

      if (!bill) {
        return NextResponse.json({ message: "Bill not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "Bill updated successfully", bill });
    } else {
      const bill = await Bill.findOneAndUpdate({ _id: id, userId }, billData, { new: true, runValidators: true });

      if (!bill) {
        return NextResponse.json({ message: "Bill not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "Bill updated successfully", bill });
    }
  } catch (error) {
    console.error("Error updating bill:", error);
    return NextResponse.json({ message: "Internal server error", error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    // Connect to the database
    await dbConnect();

    // Check authentication
    const session = await getServerSession(authOptions as any);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Try to delete from each collection
    let deletedBill = await FuelBill.findOneAndDelete({ _id: id, userId });

    if (!deletedBill) {
      deletedBill = await RentReceipt.findOneAndDelete({ _id: id, userId });
    }

    if (!deletedBill) {
      deletedBill = await Bill.findOneAndDelete({ _id: id, userId });
    }

    if (!deletedBill) {
      return NextResponse.json({ message: "Bill not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Bill deleted successfully" });
  } catch (error) {
    console.error("Error deleting bill:", error);
    return NextResponse.json({ message: "Internal server error", error: (error as Error).message }, { status: 500 });
  }
}
