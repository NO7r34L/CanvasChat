"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Save, Download, Share2, Users as UsersIcon, Loader2 } from "lucide-react";
import { CanvasChat } from "@/components/canvas-chat";
import { CanvasToolbar } from "@/components/canvas-toolbar";
import { CanvasAnimations } from "@/components/canvas-animations";
import { ProfileButton } from "@/components/profile-button";
import { VersionHistory } from "@/components/version-history";
import { AIDrawingTool } from "@/components/ai-drawing-tool";
import { AnimationBuilder } from "@/components/animation-builder";
import Dither from "@/components/Dither";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCanvasStore } from "@/stores/canvas-store";
import {
  exportCanvasAsPNG,
  exportCanvasAsSVG,
  exportCanvasAsJSON,
  downloadCanvas,
} from "@/lib/canvas-utils";

/**
 * Canvas Page Component
 * Layout for canvas chat interface with toolbar and animation controls
 */

export function CanvasPage() {
  const searchParams = useSearchParams();
  const canvasIdParam = searchParams.get("id");

  const {
    canvas,
    currentCanvasId,
    currentCanvasTitle,
    setCurrentCanvasTitle,
    isSaving,
    lastSaved,
    saveCanvas,
    loadCanvas,
  } = useCanvasStore();

  const [isExporting, setIsExporting] = useState(false);

  // Load canvas from URL param if present
  useEffect(() => {
    if (canvasIdParam && canvas) {
      const id = parseInt(canvasIdParam);
      if (!isNaN(id)) {
        loadCanvas(id);
      }
    }
  }, [canvasIdParam, canvas, loadCanvas]);

  const handleSave = async () => {
    try {
      await saveCanvas();
    } catch (error) {
      console.error("Failed to save canvas:", error);
    }
  };

  const handleExport = async (format: "png" | "svg" | "json") => {
    if (!canvas) return;

    setIsExporting(true);
    try {
      if (format === "png") {
        const blob = await exportCanvasAsPNG(canvas);
        downloadCanvas(blob, currentCanvasTitle, "png");
      } else if (format === "svg") {
        const svg = exportCanvasAsSVG(canvas);
        const blob = new Blob([svg], { type: "image/svg+xml" });
        downloadCanvas(blob, currentCanvasTitle, "svg");
      } else if (format === "json") {
        const json = exportCanvasAsJSON(canvas);
        const blob = new Blob([json], { type: "application/json" });
        downloadCanvas(blob, currentCanvasTitle, "json");
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex h-dvh flex-col">
      <header className="relative w-full flex items-center justify-between px-4 py-2 bg-[#FF4A04] text-white border-b border-[#FBAE41] overflow-hidden">
        {/* Dither background effect */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Dither
            waveColor={[1.0, 0.29, 0.02]}
            waveColor2={[1.0, 0.87, 0.6]}
            disableAnimation={false}
            enableMouseInteraction={true}
            mouseRadius={0.3}
            colorNum={8}
            waveAmplitude={0.15}
            waveFrequency={2}
            waveSpeed={0.03}
            pixelSize={2}
          />
        </div>

        {/* Header content */}
        <div className="relative z-10 flex items-center space-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="66"
            height="30"
            viewBox="0 0 66 30"
            fill="none"
            className="shrink-0 transition-colors duration-200 ease-out text-background-100"
          >
            <path
              fill="currentColor"
              className="transition-colors duration-400 ease-out"
              d="M52.688 13.028c-.22 0-.437.008-.654.015a.3.3 0 0 0-.102.024.37.37 0 0 0-.236.255l-.93 3.249c-.401 1.397-.252 2.687.422 3.634.618.876 1.646 1.39 2.894 1.45l5.045.306a.45.45 0 0 1 .435.41.5.5 0 0 1-.025.223.64.64 0 0 1-.547.426l-5.242.306c-2.848.132-5.912 2.456-6.987 5.29l-.378 1a.28.28 0 0 0 .248.382h18.054a.48.48 0 0 0 .464-.35c.32-1.153.482-2.344.48-3.54 0-7.22-5.79-13.072-12.933-13.072M44.807 29.578l.334-1.175c.402-1.397.253-2.687-.42-3.634-.62-.876-1.647-1.39-2.896-1.45l-23.665-.306a.47.47 0 0 1-.374-.199.5.5 0 0 1-.052-.434.64.64 0 0 1 .552-.426l23.886-.306c2.836-.131 5.9-2.456 6.975-5.29l1.362-3.6a.9.9 0 0 0 .04-.477C48.997 5.259 42.789 0 35.367 0c-6.842 0-12.647 4.462-14.73 10.665a6.92 6.92 0 0 0-4.911-1.374c-3.28.33-5.92 3.002-6.246 6.318a7.2 7.2 0 0 0 .18 2.472C4.3 18.241 0 22.679 0 28.133q0 .74.106 1.453a.46.46 0 0 0 .457.402h43.704a.57.57 0 0 0 .54-.418"
            ></path>
          </svg>

          {/* Canvas Title */}
          <Input
            value={currentCanvasTitle}
            onChange={(e) => setCurrentCanvasTitle(e.target.value)}
            className="w-64 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="Canvas title..."
          />

          {/* Save Status */}
          {lastSaved && (
            <span className="text-xs text-white/80">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="relative z-10 flex items-center gap-2">
          {/* Save Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSaving ? "Saving..." : "Save"}
          </Button>

          {/* Export Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" disabled={isExporting}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("png")}>
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("svg")}>
                Export as SVG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("json")}>
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Version History */}
          {currentCanvasId && <VersionHistory canvasId={currentCanvasId} />}

          {/* AI Tool */}
          <AIDrawingTool />

          {/* Share Button */}
          <Button variant="secondary" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>

          {/* Profile */}
          <ProfileButton />
        </div>
      </header>

      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        {/* Left sidebar - Tools */}
        <aside className="w-80 overflow-y-auto">
          <CanvasToolbar />
        </aside>

        {/* Main canvas area */}
        <main className="flex-1 overflow-hidden">
          <CanvasChat
            width={1200}
            height={800}
            className="w-full h-full border-2 border-border"
          />
        </main>

        {/* Right sidebar - Animations */}
        <aside className="w-80 overflow-y-auto space-y-4">
          <CanvasAnimations />
          <div className="mt-4">
            <AnimationBuilder />
          </div>
        </aside>
      </div>
    </div>
  );
}

