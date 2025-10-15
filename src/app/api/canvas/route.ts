import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/lib/stack/server";
import { db } from "@/lib/db/db";
import { canvasesTable } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const canvases = await db
      .select()
      .from(canvasesTable)
      .where(eq(canvasesTable.userId, user.id))
      .orderBy(desc(canvasesTable.updatedAt));

    return NextResponse.json(canvases);
  } catch (error) {
    console.error("Error fetching canvases:", error);
    return NextResponse.json(
      { error: "Failed to fetch canvases" },
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
    const body = await req.json() as {
      title: string;
      fabricData: string;
      thumbnail?: string;
      width?: number;
      height?: number;
      isPublic?: boolean;
      isFavorite?: boolean;
    };

    const canvas = await db
      .insert(canvasesTable)
      .values({
        userId: user.id,
        title: body.title || "Untitled Canvas",
        fabricData: body.fabricData,
        thumbnail: body.thumbnail,
        width: body.width || 1200,
        height: body.height || 800,
        isPublic: body.isPublic || false,
        isFavorite: body.isFavorite || false,
      })
      .returning();

    return NextResponse.json(canvas[0]);
  } catch (error) {
    console.error("Error creating canvas:", error);
    return NextResponse.json(
      { error: "Failed to create canvas" },
      { status: 500 }
    );
  }
}

