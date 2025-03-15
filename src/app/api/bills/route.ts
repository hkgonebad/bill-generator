import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { Bill, FuelBill, RentReceipt } from "@/models/Bill";

// Helper to check and update credit usage
async function checkAndUpdateCredits(userId: string) {
  const user = await User.findById(userId);

  // Check if user exists
  if (!user) {
    throw new Error("User not found");
  }

  // Reset credits if needed
  user.resetWeeklyCredits();

  // Check if user has reached weekly limit
  if (user.credits.weeklyBillsGenerated >= 10) {
    throw new Error("Weekly bill generation limit reached");
  }

  // Update credit usage
  user.credits.weeklyBillsGenerated += 1;
  await user.save();

  return user;
}

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions as any);

    // Check authentication
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get bills for the authenticated user
    const userId = session.user.id;

    // Get query parameters
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    let bills;

    if (type === "fuel") {
      bills = await FuelBill.find({ userId }).sort({ createdAt: -1 });
    } else if (type === "rent") {
      bills = await RentReceipt.find({ userId }).sort({ createdAt: -1 });
    } else {
      // Fetch all bill types
      const fuelBills = await FuelBill.find({ userId }).sort({ createdAt: -1 });
      const rentReceipts = await RentReceipt.find({ userId }).sort({ createdAt: -1 });

      bills = [...fuelBills.map((bill) => ({ ...bill.toObject(), billType: "fuel" })), ...rentReceipts.map((bill) => ({ ...bill.toObject(), billType: "rent" }))].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return NextResponse.json({ bills });
  } catch (error) {
    console.error("Error fetching bills:", error);
    return NextResponse.json({ message: "Internal server error", error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions as any);

    // Check authentication
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { billType, ...billData } = body;

    // Check credits and update usage
    const user = await checkAndUpdateCredits(userId);

    // Create the bill based on type
    let savedBill;

    if (billType === "fuel") {
      savedBill = await FuelBill.create({
        userId,
        name: billData.name || `Fuel Bill - ${new Date().toLocaleDateString()}`,
        ...billData,
      });
    } else if (billType === "rent") {
      savedBill = await RentReceipt.create({
        userId,
        name: billData.name || `Rent Receipt - ${new Date().toLocaleDateString()}`,
        ...billData,
      });
    } else {
      // Generic bill
      savedBill = await Bill.create({
        userId,
        billType,
        name: billData.name || `Bill - ${new Date().toLocaleDateString()}`,
        data: billData,
      });
    }

    return NextResponse.json(
      {
        message: "Bill created successfully",
        bill: savedBill,
        credits: user.credits,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bill:", error);

    if ((error as Error).message === "Weekly bill generation limit reached") {
      return NextResponse.json(
        {
          message: "You have reached your weekly bill generation limit",
          error: (error as Error).message,
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        message: "Internal server error",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
