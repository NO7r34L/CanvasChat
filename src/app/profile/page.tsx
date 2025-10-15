import { stackServerApp } from "@/lib/stack/server";
import { ProfileSettings } from "@/components/profile-settings";

/**
 * Profile Settings Page
 * Protected route for user profile and preferences
 */

export default async function ProfilePage() {
  const user = await stackServerApp.getUser({ or: "redirect" });
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <ProfileSettings user={user} />
    </div>
  );
}

