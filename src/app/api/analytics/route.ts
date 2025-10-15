import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/lib/stack/server";
import { db } from "@/lib/db/db";
import { analyticsTable } from "@/lib/db/schema";
import { eq, sql, desc, and, gte } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get events for the user in the specified time range
    const events = await db
      .select()
      .from(analyticsTable)
      .where(
        and(
          eq(analyticsTable.userId, user.id),
          gte(analyticsTable.createdAt, startDate)
        )
      )
      .orderBy(desc(analyticsTable.createdAt));

    // Aggregate by event type
    const eventCounts = await db
      .select({
        event: analyticsTable.event,
        count: sql<number>`count(*)`,
      })
      .from(analyticsTable)
      .where(
        and(
          eq(analyticsTable.userId, user.id),
          gte(analyticsTable.createdAt, startDate)
        )
      )
      .groupBy(analyticsTable.event);

    return NextResponse.json({
      events,
      eventCounts,
      timeRange: { days, startDate },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const event = await db
      .insert(analyticsTable)
      .values({
        userId: user.id,
        event: body.event,
        metadata: body.metadata ? JSON.stringify(body.metadata) : null,
      })
      .returning();

    return NextResponse.json(event[0]);
  } catch (error) {
    console.error("Error logging analytics event:", error);
    return NextResponse.json(
      { error: "Failed to log event" },
      { status: 500 }
    );
  }
}

