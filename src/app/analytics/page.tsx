import { stackServerApp } from "@/lib/stack/server";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";

/**
 * Analytics Dashboard Page
 * Protected route for viewing usage statistics
 */

export default async function AnalyticsPage() {
  await stackServerApp.getUser({ or: "redirect" });
  return (
    <div className="container mx-auto px-4 py-8">
      <AnalyticsDashboard />
    </div>
  );
}

