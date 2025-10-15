import { stackServerApp } from "@/lib/stack/server";
import { CanvasPage } from "@/components/canvas-page";

/**
 * Canvas Chat Page
 * Protected route for canvas-based chat interface
 */

export default async function Canvas() {
  await stackServerApp.getUser({ or: "redirect" });
  return <CanvasPage />;
}

