import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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

  // Create response and set cookie
  const response = NextResponse.json({
    authenticated: false,
    message: "Anonymous usage retrieved",
    credits: anonymousUsage,
  });

  return setAnonymousUsageCookie(response, anonymousUsage);
}

export async function POST(request: NextRequest) {
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
  if (anonymousUsage.weeklyBillsGenerated >= 2) {
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
