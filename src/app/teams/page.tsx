import { stackServerApp } from "@/lib/stack/server";
import { TeamsListPage } from "@/components/teams-list-page";

/**
 * Teams List Page
 * Protected route for viewing and managing teams
 */

export default async function TeamsPage() {
  await stackServerApp.getUser({ or: "redirect" });
  return <TeamsListPage />;
}

