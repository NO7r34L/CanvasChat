"use client";

import { useCanvasStore, type CanvasTool } from "@/stores/canvas-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MousePointer2,
  Pencil,
  Type,
  Square,
  Eraser,
  Trash2,
  RotateCcw,
  RotateCw,
  Sparkles,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Canvas Toolbar Component
 * Provides tools and controls for the canvas
 */

export function CanvasToolbar() {
  const {
    activeTool,
    setActiveTool,
    brushColor,
    setBrushColor,
    brushWidth,
    setBrushWidth,
    animationEnabled,
    toggleAnimation,
    animationDuration,
    setAnimationDuration,
    clearCanvas,
    canUndo,
    canRedo,
  } = useCanvasStore();

  const tools: { id: CanvasTool; icon: typeof MousePointer2; label: string }[] = [
    { id: "select", icon: MousePointer2, label: "Select" },
    { id: "draw", icon: Pencil, label: "Draw" },
    { id: "text", icon: Type, label: "Text" },
    { id: "shape", icon: Square, label: "Shape" },
    { id: "erase", icon: Eraser, label: "Erase" },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Canvas Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tool Selection */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Tools</Label>
          <TooltipProvider>
            <div className="flex gap-2 flex-wrap">
              {tools.map(({ id, icon: Icon, label }) => (
                <Tooltip key={id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeTool === id ? "default" : "outline"}
                      size="icon"
                      onClick={() => setActiveTool(id)}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>

        <Separator />

        {/* Brush Settings */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="color" className="text-sm font-medium mb-2 block">
              Brush Color
            </Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="flex-1 font-mono"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="width" className="text-sm font-medium mb-2 block">
              Brush Width: {brushWidth}px
            </Label>
            <Slider
              id="width"
              min={1}
              max={50}
              step={1}
              value={[brushWidth]}
              onValueChange={([value]) => setBrushWidth(value)}
              className="w-full"
            />
          </div>
        </div>

        <Separator />

        {/* Animation Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Animations</Label>
            <Button
              variant={animationEnabled ? "default" : "outline"}
              size="sm"
              onClick={toggleAnimation}
              className="h-8"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              {animationEnabled ? "On" : "Off"}
            </Button>
          </div>

          {animationEnabled && (
            <div>
              <Label htmlFor="duration" className="text-sm font-medium mb-2 block">
                Duration: {animationDuration}ms
              </Label>
              <Slider
                id="duration"
                min={100}
                max={2000}
                step={50}
                value={[animationDuration]}
                onValueChange={([value]) => setAnimationDuration(value)}
                className="w-full"
              />
            </div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Actions</Label>
          <div className="flex gap-2 flex-wrap">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={!canUndo}
                    onClick={() => {
                      // Implement undo logic
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Undo</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={!canRedo}
                    onClick={() => {
                      // Implement redo logic
                    }}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Redo</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={clearCanvas}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear Canvas</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

