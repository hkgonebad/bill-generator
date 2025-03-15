import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    await dbConnect();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Please provide all required fields" }, { status: 400 });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      credits: {
        weeklyBillsGenerated: 0,
        lastResetDate: new Date(),
      },
    });

    // Return success but don't include password
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal server error", error: (error as Error).message }, { status: 500 });
  }
}
