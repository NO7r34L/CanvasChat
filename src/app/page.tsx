import { redirect } from "next/navigation";
import { stackServerApp } from "@/lib/stack/server";

/**
 * Home Page
 * Redirects authenticated users to canvas chat
 */

export default async function Home() {
  await stackServerApp.getUser({ or: "redirect" });
  redirect("/canvas");
}
