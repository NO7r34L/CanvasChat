"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Sparkles, Grid3x3, Layers, FileText, Shapes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SelectTemplate } from "@/lib/db/schema";

const categories = [
  { id: "all", label: "All Templates", icon: Grid3x3 },
  { id: "presentation", label: "Presentations", icon: Layers },
  { id: "diagram", label: "Diagrams", icon: Shapes },
  { id: "wireframe", label: "Wireframes", icon: FileText },
  { id: "social", label: "Social Media", icon: Sparkles },
];

export function TemplatesGallery() {
  const [category, setCategory] = useState<string>("all");
  const router = useRouter();

  const { data: templates, isLoading } = useQuery<SelectTemplate[]>({
    queryKey: ["templates", category],
    queryFn: async () => {
      const url =
        category === "all"
          ? "/api/templates"
          : `/api/templates?category=${category}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch templates");
      return response.json();
    },
  });

  const handleUseTemplate = async (template: SelectTemplate) => {
    // Create a new canvas from template
    try {
      const response = await fetch("/api/canvas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${template.title} (Copy)`,
          fabricData: template.fabricData,
          thumbnail: template.thumbnail,
        }),
      });

      if (response.ok) {
        const canvas = await response.json() as { id: number };
        router.push(`/canvas?id=${canvas.id}`);
      }
    } catch (error) {
      console.error("Failed to create canvas from template:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Canvas Templates</h1>
        <p className="text-muted-foreground">
          Start with a professional template and customize it
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCategory(id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              category === id
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <div className="p-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="mt-2 h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates && templates.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="group overflow-hidden transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-0">
                {/* Thumbnail */}
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  {template.thumbnail ? (
                    <img
                      src={template.thumbnail}
                      alt={template.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Grid3x3 className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {/* Official Badge */}
                  {template.isOfficial && (
                    <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                      Official
                    </div>
                  )}
                  {/* Use Template Button */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      onClick={() => handleUseTemplate(template)}
                      size="sm"
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold">{template.title}</h3>
                  {template.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-96 flex-col items-center justify-center text-center">
          <Grid3x3 className="h-16 w-16 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No templates found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try selecting a different category
          </p>
        </div>
      )}
    </div>
  );
}

