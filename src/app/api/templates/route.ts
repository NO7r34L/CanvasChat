import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/lib/stack/server";
import { db } from "@/lib/db/db";
import { templatesTable } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let query = db.select().from(templatesTable).orderBy(desc(templatesTable.createdAt));

    if (category) {
      query = query.where(eq(templatesTable.category, category)) as typeof query;
    }

    const templates = await query;
    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
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

    const template = await db
      .insert(templatesTable)
      .values({
        title: body.title,
        description: body.description,
        fabricData: body.fabricData,
        thumbnail: body.thumbnail,
        category: body.category || "other",
        isOfficial: false, // User-created templates are not official
      })
      .returning();

    return NextResponse.json(template[0]);
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}

