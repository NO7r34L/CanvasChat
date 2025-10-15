"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  Plus,
  Grid3x3,
  Clock,
  Star,
  Users,
  MoreVertical,
  Trash2,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { SelectCanvas } from "@/lib/db/schema";

type FilterType = "all" | "recent" | "favorites" | "shared";

export function GalleryPageClient() {
  const [filter, setFilter] = useState<FilterType>("all");
  const router = useRouter();

  const { data: canvases, isLoading } = useQuery<SelectCanvas[]>({
    queryKey: ["canvases"],
    queryFn: async () => {
      const response = await fetch("/api/canvas");
      if (!response.ok) throw new Error("Failed to fetch canvases");
      return response.json();
    },
  });

  const filteredCanvases = canvases?.filter((canvas) => {
    if (filter === "all") return true;
    if (filter === "favorites") return canvas.isFavorite;
    if (filter === "recent")
      return (
        new Date().getTime() - new Date(canvas.updatedAt).getTime() <
        7 * 24 * 60 * 60 * 1000
      );
    return true;
  });

  const handleCreateNew = () => {
    router.push("/canvas");
  };

  const handleOpenCanvas = (id: number) => {
    router.push(`/canvas?id=${id}`);
  };

  const handleDeleteCanvas = async (id: number) => {
    if (!confirm("Are you sure you want to delete this canvas?")) return;

    try {
      await fetch(`/api/canvas/${id}`, { method: "DELETE" });
      // Invalidate query to refetch
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete canvas:", error);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Gallery</h1>
              <p className="text-sm text-muted-foreground">
                {filteredCanvases?.length || 0} canvases
              </p>
            </div>
            <Button onClick={handleCreateNew} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              New Canvas
            </Button>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6">
          <div className="flex gap-4">
            {[
              { id: "all", label: "All", icon: Grid3x3 },
              { id: "recent", label: "Recent", icon: Clock },
              { id: "favorites", label: "Favorites", icon: Star },
              { id: "shared", label: "Shared", icon: Users },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setFilter(id as FilterType)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  filter === id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas Grid */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <Skeleton className="h-48 w-full rounded-t-lg" />
                    <div className="p-4">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="mt-2 h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCanvases && filteredCanvases.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCanvases.map((canvas) => (
                <Card
                  key={canvas.id}
                  className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
                  onClick={() => handleOpenCanvas(canvas.id)}
                >
                  <CardContent className="p-0">
                    {/* Thumbnail */}
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                      {canvas.thumbnail ? (
                        <img
                          src={canvas.thumbnail}
                          alt={canvas.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Grid3x3 className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      {/* Favorite Badge */}
                      {canvas.isFavorite && (
                        <div className="absolute right-2 top-2 rounded-full bg-yellow-500 p-1.5">
                          <Star className="h-3 w-3 fill-white text-white" />
                        </div>
                      )}
                      {/* Actions Menu */}
                      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-8 w-8 rounded-full p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: Implement share
                              }}
                            >
                              <Share2 className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCanvas(canvas.id);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-4">
                      <h3 className="truncate font-semibold">
                        {canvas.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(canvas.updatedAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-96 flex-col items-center justify-center text-center">
              <Grid3x3 className="h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No canvases yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your first canvas to get started
              </p>
              <Button onClick={handleCreateNew} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Canvas
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

