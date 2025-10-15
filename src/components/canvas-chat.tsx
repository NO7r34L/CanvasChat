"use client";

import { useEffect, useRef } from "react";
import { Canvas, PencilBrush } from "fabric";
import { useCanvasStore } from "@/stores/canvas-store";
import { animateFadeInScale } from "@/lib/canvas-utils";
import { Card } from "@/components/ui/card";

/**
 * Canvas Chat Component
 * Main canvas component with Fabric.js integration
 */

interface CanvasChatProps {
  width?: number;
  height?: number;
  className?: string;
}

export function CanvasChat({
  width = 800,
  height = 600,
  className,
}: CanvasChatProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    setCanvas,
    brushColor,
    brushWidth,
    animationEnabled,
    setSelectedObject,
    isDrawingMode,
  } = useCanvasStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric.js canvas
    const fabricCanvas = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "#ffffff",
      isDrawingMode: false,
      selection: true,
    });

    // Configure free drawing brush
    const brush = new PencilBrush(fabricCanvas);
    brush.color = brushColor;
    brush.width = brushWidth;
    fabricCanvas.freeDrawingBrush = brush;

    // Event listeners
    fabricCanvas.on("selection:created", (e) => {
      if (e.selected?.[0]) {
        setSelectedObject(e.selected[0]);
      }
    });

    fabricCanvas.on("selection:updated", (e) => {
      if (e.selected?.[0]) {
        setSelectedObject(e.selected[0]);
      }
    });

    fabricCanvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    // Animate new objects when added
    fabricCanvas.on("object:added", (e) => {
      if (animationEnabled && e.target) {
        animateFadeInScale(e.target, fabricCanvas, { duration: 400 });
      }
    });

    // Store canvas instance
    setCanvas(fabricCanvas);

    // Cleanup
    return () => {
      fabricCanvas.dispose();
      setCanvas(null);
    };
  }, [width, height, setCanvas, setSelectedObject, animationEnabled]);

  // Update brush when settings change
  useEffect(() => {
    const canvas = useCanvasStore.getState().canvas;
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushWidth;
    }
  }, [brushColor, brushWidth]);

  // Update drawing mode
  useEffect(() => {
    const canvas = useCanvasStore.getState().canvas;
    if (canvas) {
      canvas.isDrawingMode = isDrawingMode;
    }
  }, [isDrawingMode]);

  return (
    <Card className={className}>
      <canvas ref={canvasRef} />
    </Card>
  );
}

