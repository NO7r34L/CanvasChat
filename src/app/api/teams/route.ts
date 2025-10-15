import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/lib/stack/server";
import { db } from "@/lib/db/db";
import { teamsTable, teamMembersTable } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get teams where user is owner or member
    const userTeams = await db
      .select()
      .from(teamsTable)
      .leftJoin(teamMembersTable, eq(teamsTable.id, teamMembersTable.teamId))
      .where(
        or(
          eq(teamsTable.ownerId, user.id),
          eq(teamMembersTable.userId, user.id)
        )
      );

    // Deduplicate teams
    const teams = Array.from(
      new Map(userTeams.map((t) => [t.teams.id, t.teams])).values()
    );

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
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

    const team = await db
      .insert(teamsTable)
      .values({
        name: body.name,
        ownerId: user.id,
      })
      .returning();

    return NextResponse.json(team[0]);
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}

