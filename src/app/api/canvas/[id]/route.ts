import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/lib/stack/server";
import { db } from "@/lib/db/db";
import { canvasesTable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

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

    return NextResponse.json(canvas[0]);
  } catch (error) {
    console.error("Error fetching canvas:", error);
    return NextResponse.json(
      { error: "Failed to fetch canvas" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const body = await req.json() as {
      title?: string;
      fabricData?: string;
      thumbnail?: string;
      width?: number;
      height?: number;
      isPublic?: boolean;
      isFavorite?: boolean;
    };

    const updated = await db
      .update(canvasesTable)
      .set({
        title: body.title,
        fabricData: body.fabricData,
        thumbnail: body.thumbnail,
        width: body.width,
        height: body.height,
        isPublic: body.isPublic,
        isFavorite: body.isFavorite,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(canvasesTable.id, canvasId),
          eq(canvasesTable.userId, user.id)
        )
      )
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Canvas not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating canvas:", error);
    return NextResponse.json(
      { error: "Failed to update canvas" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const deleted = await db
      .delete(canvasesTable)
      .where(
        and(
          eq(canvasesTable.id, canvasId),
          eq(canvasesTable.userId, user.id)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Canvas not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting canvas:", error);
    return NextResponse.json(
      { error: "Failed to delete canvas" },
      { status: 500 }
    );
  }
}

