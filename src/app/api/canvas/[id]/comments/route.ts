import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/lib/stack/server";
import { db } from "@/lib/db/db";
import { commentsTable, canvasesTable, collaborationsTable } from "@/lib/db/schema";
import { eq, and, desc, or } from "drizzle-orm";

async function hasCanvasAccess(canvasId: number, userId: string): Promise<boolean> {
  // Check if user owns the canvas
  const canvas = await db
    .select()
    .from(canvasesTable)
    .where(eq(canvasesTable.id, canvasId))
    .limit(1);

  if (canvas.length === 0) return false;
  if (canvas[0].userId === userId) return true;

  // Check if user is a collaborator
  const collaboration = await db
    .select()
    .from(collaborationsTable)
    .where(
      and(
        eq(collaborationsTable.canvasId, canvasId),
        eq(collaborationsTable.userId, userId)
      )
    )
    .limit(1);

  return collaboration.length > 0;
}

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

    // Check access
    if (!(await hasCanvasAccess(canvasId, user.id))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const comments = await db
      .select()
      .from(commentsTable)
      .where(eq(commentsTable.canvasId, canvasId))
      .orderBy(desc(commentsTable.createdAt));

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
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
    const body = await req.json() as {
      content: string;
      positionX: number;
      positionY: number;
    };

    // Check access
    if (!(await hasCanvasAccess(canvasId, user.id))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const comment = await db
      .insert(commentsTable)
      .values({
        canvasId,
        userId: user.id,
        content: body.content,
        positionX: body.positionX,
        positionY: body.positionY,
      })
      .returning();

    return NextResponse.json(comment[0]);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

