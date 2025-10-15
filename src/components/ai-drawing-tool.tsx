"use client";

import { useState } from "react";
import { Path } from "fabric";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCanvasStore } from "@/stores/canvas-store";

export function AIDrawingTool() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { canvas, brushColor } = useCanvasStore();

  const handleGenerate = async () => {
    if (!prompt.trim() || !canvas) return;

    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate drawing");

      const data = await response.json();

      // Create a Path object from the SVG path data
      const path = new Path(data.svgPath, {
        left: canvas.width ? canvas.width / 2 : 400,
        top: canvas.height ? canvas.height / 2 : 300,
        fill: brushColor,
        stroke: "#000000",
        strokeWidth: 2,
        objectCaching: false,
      });

      // Center the path
      path.set({
        originX: "center",
        originY: "center",
      });

      canvas.add(path);
      canvas.setActiveObject(path);
      canvas.renderAll();

      setOpen(false);
      setPrompt("");
    } catch (error) {
      console.error("Error generating AI drawing:", error);
      alert("Failed to generate drawing. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Sparkles className="mr-2 h-4 w-4" />
          AI Generate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Drawing Generator</DialogTitle>
          <DialogDescription>
            Describe what you want to draw and AI will create it for you
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">What would you like to draw?</Label>
            <Input
              id="prompt"
              placeholder="e.g., a simple house, a star, a heart..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isGenerating) {
                  handleGenerate();
                }
              }}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>

          <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium">Tips:</p>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>Keep descriptions simple and clear</li>
              <li>Try basic shapes first (star, heart, arrow)</li>
              <li>Generated paths can be edited like any other object</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

