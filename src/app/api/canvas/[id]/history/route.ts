import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/lib/stack/server";
import { db } from "@/lib/db/db";
import {
  canvasHistoryTable,
  canvasesTable,
} from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const canvasId = parseInt(id);

    // Verify canvas ownership
    const canvas = await db
      .select()
      .from(canvasesTable)
      .where(
        and(
          eq(canvasesTable.id, canvasId),
          eq(canvasesTable.userId, user.id)
        )
      )
      .limit(1);

    if (canvas.length === 0) {
      return NextResponse.json({ error: "Canvas not found" }, { status: 404 });
    }

    const history = await db
      .select()
      .from(canvasHistoryTable)
      .where(eq(canvasHistoryTable.canvasId, canvasId))
      .orderBy(desc(canvasHistoryTable.version));

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching canvas history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const canvasId = parseInt(id);
    const body = await req.json();

    // Verify canvas ownership
    const canvas = await db
      .select()
      .from(canvasesTable)
      .where(
        and(
          eq(canvasesTable.id, canvasId),
          eq(canvasesTable.userId, user.id)
        )
      )
      .limit(1);

    if (canvas.length === 0) {
      return NextResponse.json({ error: "Canvas not found" }, { status: 404 });
    }

    // Get the latest version number
    const latestHistory = await db
      .select()
      .from(canvasHistoryTable)
      .where(eq(canvasHistoryTable.canvasId, canvasId))
      .orderBy(desc(canvasHistoryTable.version))
      .limit(1);

    const nextVersion = latestHistory.length > 0 ? latestHistory[0].version + 1 : 1;

    const historyEntry = await db
      .insert(canvasHistoryTable)
      .values({
        canvasId,
        fabricData: body.fabricData,
        version: nextVersion,
      })
      .returning();

    return NextResponse.json(historyEntry[0]);
  } catch (error) {
    console.error("Error creating history entry:", error);
    return NextResponse.json(
      { error: "Failed to create history entry" },
      { status: 500 }
    );
  }
}

