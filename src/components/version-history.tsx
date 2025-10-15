"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { History, RotateCcw, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { SelectCanvasHistory } from "@/lib/db/schema";
import { useCanvasStore } from "@/stores/canvas-store";

interface VersionHistoryProps {
  canvasId: number;
}

export function VersionHistory({ canvasId }: VersionHistoryProps) {
  const [open, setOpen] = useState(false);
  const { canvas } = useCanvasStore();

  const { data: history, isLoading } = useQuery<SelectCanvasHistory[]>({
    queryKey: ["canvas-history", canvasId],
    queryFn: async () => {
      const response = await fetch(`/api/canvas/${canvasId}/history`);
      if (!response.ok) throw new Error("Failed to fetch history");
      return response.json();
    },
    enabled: open && !!canvasId,
  });

  const handleRestore = async (version: SelectCanvasHistory) => {
    if (!canvas) return;

    try {
      // Load the historical version
      canvas.clear();
      canvas.loadFromJSON(JSON.parse(version.fabricData), () => {
        canvas.renderAll();
        setOpen(false);
      });
    } catch (error) {
      console.error("Error restoring version:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="mr-2 h-4 w-4" />
          History
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Version History</SheetTitle>
          <SheetDescription>
            Restore your canvas to a previous version
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : history && history.length > 0 ? (
            <div className="space-y-4">
              {history.map((version, index) => (
                <Card
                  key={version.id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">Version {version.version}</p>
                          {index === 0 && (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                              Latest
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(version.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(version)}
                        disabled={index === 0}
                      >
                        <RotateCcw className="mr-1 h-3 w-3" />
                        Restore
                      </Button>
                    </div>

                    {/* Preview thumbnail (optional) */}
                    <div className="mt-3 rounded-md bg-muted p-2">
                      <p className="text-xs text-muted-foreground">
                        Saved {new Date(version.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-[400px] flex-col items-center justify-center text-center">
              <History className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-semibold">No version history</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Versions are created automatically as you work
              </p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

