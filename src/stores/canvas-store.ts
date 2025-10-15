import { create } from "zustand";
import type { Canvas, Object as FabricObject } from "fabric";

/**
 * Canvas Store
 * Manages canvas state, tools, and animation settings for the canvas chat
 */

export type CanvasTool = "select" | "draw" | "text" | "shape" | "erase";

interface CanvasStore {
  // Canvas instance
  canvas: Canvas | null;
  setCanvas: (canvas: Canvas | null) => void;

  // Tool state
  activeTool: CanvasTool;
  setActiveTool: (tool: CanvasTool) => void;

  // Drawing settings
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushWidth: number;
  setBrushWidth: (width: number) => void;

  // Animation settings
  animationEnabled: boolean;
  toggleAnimation: () => void;
  animationDuration: number;
  setAnimationDuration: (duration: number) => void;

  // Selection
  selectedObject: FabricObject | null;
  setSelectedObject: (obj: FabricObject | null) => void;

  // Canvas state
  isDrawingMode: boolean;
  setDrawingMode: (enabled: boolean) => void;

  // History for undo/redo
  canUndo: boolean;
  canRedo: boolean;
  setCanUndo: (can: boolean) => void;
  setCanRedo: (can: boolean) => void;

  // Clear canvas
  clearCanvas: () => void;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  // Canvas
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),

  // Tools
  activeTool: "select",
  setActiveTool: (tool) => {
    const isDrawing = tool === "draw";
    set({ activeTool: tool, isDrawingMode: isDrawing });
    const canvas = get().canvas;
    if (canvas) {
      canvas.isDrawingMode = isDrawing;
    }
  },

  // Drawing settings
  brushColor: "#000000",
  setBrushColor: (color) => {
    set({ brushColor: color });
    const canvas = get().canvas;
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }
  },
  brushWidth: 2,
  setBrushWidth: (width) => {
    set({ brushWidth: width });
    const canvas = get().canvas;
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = width;
    }
  },

  // Animation
  animationEnabled: true,
  toggleAnimation: () => set((state) => ({ animationEnabled: !state.animationEnabled })),
  animationDuration: 300,
  setAnimationDuration: (duration) => set({ animationDuration: duration }),

  // Selection
  selectedObject: null,
  setSelectedObject: (obj) => set({ selectedObject: obj }),

  // Drawing mode
  isDrawingMode: false,
  setDrawingMode: (enabled) => {
    set({ isDrawingMode: enabled });
    const canvas = get().canvas;
    if (canvas) {
      canvas.isDrawingMode = enabled;
    }
  },

  // History
  canUndo: false,
  canRedo: false,
  setCanUndo: (can) => set({ canUndo: can }),
  setCanRedo: (can) => set({ canRedo: can }),

  // Clear
  clearCanvas: () => {
    const canvas = get().canvas;
    if (canvas) {
      canvas.clear();
    }
  },
}));

