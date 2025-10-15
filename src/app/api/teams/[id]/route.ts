import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/lib/stack/server";
import { db } from "@/lib/db/db";
import { teamsTable, teamMembersTable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

async function isTeamOwnerOrAdmin(teamId: number, userId: string): Promise<boolean> {
  const team = await db
    .select()
    .from(teamsTable)
    .where(eq(teamsTable.id, teamId))
    .limit(1);

  if (team.length === 0) return false;
  if (team[0].ownerId === userId) return true;

  const member = await db
    .select()
    .from(teamMembersTable)
    .where(
      and(
        eq(teamMembersTable.teamId, teamId),
        eq(teamMembersTable.userId, userId),
        eq(teamMembersTable.role, "admin")
      )
    )
    .limit(1);

  return member.length > 0;
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
    const teamId = parseInt(id);

    const team = await db
      .select()
      .from(teamsTable)
      .where(eq(teamsTable.id, teamId))
      .limit(1);

    if (team.length === 0) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Get team members
    const members = await db
      .select()
      .from(teamMembersTable)
      .where(eq(teamMembersTable.teamId, teamId));

    return NextResponse.json({
      ...team[0],
      members,
    });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
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
    const teamId = parseInt(id);
    const body = await req.json() as { name: string };

    // Check permissions
    if (!(await isTeamOwnerOrAdmin(teamId, user.id))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await db
      .update(teamsTable)
      .set({ name: body.name })
      .where(eq(teamsTable.id, teamId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
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
    const teamId = parseInt(id);

    // Only owner can delete team
    const team = await db
      .select()
      .from(teamsTable)
      .where(
        and(eq(teamsTable.id, teamId), eq(teamsTable.ownerId, user.id))
      )
      .limit(1);

    if (team.length === 0) {
      return NextResponse.json(
        { error: "Team not found or you are not the owner" },
        { status: 404 }
      );
    }

    await db.delete(teamsTable).where(eq(teamsTable.id, teamId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
}

