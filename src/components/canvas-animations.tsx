"use client";

import { useCanvasStore } from "@/stores/canvas-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  animatePulse,
  animateBounce,
  animateShake,
  animateRotation,
  animateScale,
} from "@/lib/canvas-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Activity,
  ArrowUp,
  Move,
  RotateCw,
  Maximize2,
  Sparkles,
} from "lucide-react";

/**
 * Canvas Animations Component
 * Provides preset animation controls for selected objects
 */

export function CanvasAnimations() {
  const { canvas, selectedObject, animationDuration } = useCanvasStore();

  const handleAnimation = (
    animFn: (obj: any, canvas: any, ...args: any[]) => void,
    ...args: any[]
  ) => {
    if (!canvas || !selectedObject) return;
    animFn(selectedObject, canvas, ...args);
  };

  const animations = [
    {
      id: "pulse",
      label: "Pulse",
      icon: Activity,
      description: "Scale up and down",
      action: () => handleAnimation(animatePulse, { duration: animationDuration }),
    },
    {
      id: "bounce",
      label: "Bounce",
      icon: ArrowUp,
      description: "Bounce vertically",
      action: () => handleAnimation(animateBounce, 50, { duration: animationDuration }),
    },
    {
      id: "shake",
      label: "Shake",
      icon: Move,
      description: "Shake horizontally",
      action: () => handleAnimation(animateShake, 10, { duration: animationDuration }),
    },
    {
      id: "rotate",
      label: "Rotate",
      icon: RotateCw,
      description: "Rotate 360°",
      action: () => {
        if (!selectedObject) return;
        const currentAngle = selectedObject.angle || 0;
        handleAnimation(animateRotation, currentAngle + 360, { duration: animationDuration });
      },
    },
    {
      id: "scale",
      label: "Scale",
      icon: Maximize2,
      description: "Scale to 1.5x",
      action: () => handleAnimation(animateScale, 1.5, { duration: animationDuration }),
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Animations
        </CardTitle>
        <CardDescription>
          {selectedObject
            ? "Apply animations to selected object"
            : "Select an object to animate"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider>
          <div className="grid grid-cols-2 gap-2">
            {animations.map(({ id, label, icon: Icon, description, action }) => (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={!selectedObject}
                    onClick={action}
                    className="h-20 flex flex-col gap-1"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Quick Actions</h4>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!selectedObject}
              onClick={() => {
                if (!selectedObject) return;
                selectedObject.set({ angle: 0, scaleX: 1, scaleY: 1, opacity: 1 });
                canvas?.requestRenderAll();
              }}
            >
              Reset Transform
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!selectedObject}
              onClick={() => {
                if (!canvas || !selectedObject) return;
                canvas.remove(selectedObject);
                canvas.requestRenderAll();
              }}
            >
              Delete Selected
            </Button>
          </div>
        </div>

        <Separator />

        <div className="text-xs text-muted-foreground space-y-1">
          <p>Keyboard shortcuts:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Delete - Remove selected</li>
            <li>Ctrl/Cmd + C - Copy</li>
            <li>Ctrl/Cmd + V - Paste</li>
            <li>Ctrl/Cmd + Z - Undo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

