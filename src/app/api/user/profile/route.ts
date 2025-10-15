import { NextResponse } from "next/server";
import { stackServerApp } from "@/lib/stack/server";

/**
 * Example API route for fetching user profile
 * This demonstrates the pattern for creating API routes that work with TanStack Query
 */

export const runtime = "edge";

export async function GET() {
  try {
    // Get authenticated user
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Return user profile data
    // In a real app, you might fetch additional data from the database here
    return NextResponse.json({
      id: user.id,
      displayName: user.displayName,
      primaryEmail: user.primaryEmail,
      profileImageUrl: user.profileImageUrl,
      createdAt: new Date().toISOString(), // user.createdAt not available in CurrentServerUser
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Update user profile (example)
    // In a real app, you would update the database here
    
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

