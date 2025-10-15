"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, Users, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsData {
  events: Array<{
    id: number;
    userId: string;
    event: string;
    metadata: string | null;
    createdAt: Date;
  }>;
  eventCounts: Array<{
    event: string;
    count: number;
  }>;
  timeRange: {
    days: number;
    startDate: Date;
  };
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState(30);

  const { data, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["analytics", timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/analytics?days=${timeRange}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
  });

  const totalEvents = data?.events.length || 0;
  const canvasesCreated = data?.eventCounts.find((e) => e.event === "canvas:created")?.count || 0;
  const canvasesSaved = data?.eventCounts.find((e) => e.event === "canvas:saved")?.count || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Track your usage and productivity
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {[7, 30, 90].map((days) => (
          <button
            key={days}
            onClick={() => setTimeRange(days)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              timeRange === days
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            Last {days} days
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                Last {timeRange} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Canvases Created</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{canvasesCreated}</div>
              <p className="text-xs text-muted-foreground">
                New canvases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saves</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{canvasesSaved}</div>
              <p className="text-xs text-muted-foreground">
                Canvas saves
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Daily Usage</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(totalEvents / timeRange)}
              </div>
              <p className="text-xs text-muted-foreground">
                Events per day
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Event Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest canvas interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : data?.eventCounts && data.eventCounts.length > 0 ? (
            <div className="space-y-4">
              {data.eventCounts.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium capitalize">
                      {item.event.replace(/:/g, " ")}
                    </p>
                  </div>
                  <div className="text-2xl font-bold">{item.count}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No activity in this time range
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

