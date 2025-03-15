import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// Cookie name for tracking anonymous usage
const ANONYMOUS_CREDIT_COOKIE = "bill_generator_anonymous_usage";

// Get anonymous usage from cookie
function getAnonymousUsage() {
  const cookieStore = cookies();
  const anonymousUsageCookie = cookieStore.get(ANONYMOUS_CREDIT_COOKIE);

  if (!anonymousUsageCookie?.value) {
    return null;
  }

  try {
    return JSON.parse(anonymousUsageCookie.value);
  } catch (error) {
    console.error("Error parsing anonymous usage cookie:", error);
    return null;
  }
}

// Set anonymous usage cookie
function setAnonymousUsageCookie(response: NextResponse, usage: any) {
  const oneWeek = 7 * 24 * 60 * 60; // 1 week in seconds

  response.cookies.set({
    name: ANONYMOUS_CREDIT_COOKIE,
    value: JSON.stringify(usage),
    maxAge: oneWeek,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    path: "/",
  });

  return response;
}

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions as any);

    // Check authentication
    if (!session) {
      return NextResponse.json(
        {
          authenticated: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    // Get user ID from session
    const userId = session.user.id;

    // Find user in database
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Reset credits if needed
    user.resetWeeklyCredits();
    await user.save();

    // Return credits information
    return NextResponse.json({
      weeklyBillsGenerated: user.credits.weeklyBillsGenerated,
      weeklyBillsLimit: 10, // Using the increased limit for testing
      lastReset: user.credits.lastResetDate,
    });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json({ message: "Internal server error", error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // If user is authenticated, don't use anonymous tracking
  const session = await getServerSession(authOptions as any);
  if (session) {
    return NextResponse.json({
      authenticated: true,
      message: "Authenticated users are tracked in the database",
    });
  }

  // Get current usage or initialize
  let anonymousUsage = getAnonymousUsage() || {
    weeklyBillsGenerated: 0,
    lastResetDate: new Date().toISOString(),
  };

  // Check if we need to reset weekly credits
  const now = new Date();
  const lastReset = new Date(anonymousUsage.lastResetDate);
  const oneWeek = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds

  if (now.getTime() - lastReset.getTime() >= oneWeek) {
    anonymousUsage.weeklyBillsGenerated = 0;
    anonymousUsage.lastResetDate = now.toISOString();
  }

  // Check if user has reached weekly limit
  if (anonymousUsage.weeklyBillsGenerated >= 10) {
    return NextResponse.json(
      {
        message: "You have reached your weekly bill generation limit. Please register for an account.",
      },
      { status: 403 }
    );
  }

  // Update usage
  anonymousUsage.weeklyBillsGenerated += 1;

  // Create response and set cookie
  const response = NextResponse.json({
    authenticated: false,
    message: "Anonymous usage updated",
    credits: anonymousUsage,
  });

  return setAnonymousUsageCookie(response, anonymousUsage);
}
