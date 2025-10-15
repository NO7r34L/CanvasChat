import { stackServerApp } from "@/lib/stack/server";
import { GalleryPageClient } from "@/components/gallery-page";

/**
 * Gallery Page
 * Protected route for viewing user's canvas gallery
 */

export default async function GalleryPage() {
  await stackServerApp.getUser({ or: "redirect" });
  return <GalleryPageClient />;
}

