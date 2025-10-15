import { create } from "zustand";
import type { Canvas, Object as FabricObject } from "fabric";

/**
 * Canvas Store
 * Manages canvas state, tools, and animation settings for the canvas chat
 */

export type CanvasTool = "select" | "draw" | "text" | "shape" | "erase" | "comment";

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

  // Canvas save/load state
  currentCanvasId: number | null;
  currentCanvasTitle: string;
  isSaving: boolean;
  lastSaved: Date | null;
  autoSaveEnabled: boolean;

  // Actions
  setCurrentCanvasId: (id: number | null) => void;
  setCurrentCanvasTitle: (title: string) => void;
  saveCanvas: () => Promise<void>;
  loadCanvas: (id: number) => Promise<void>;
  createNewCanvas: () => Promise<void>;
  setAutoSave: (enabled: boolean) => void;
  
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

  // Canvas save/load
  currentCanvasId: null,
  currentCanvasTitle: "Untitled Canvas",
  isSaving: false,
  lastSaved: null,
  autoSaveEnabled: true,

  setCurrentCanvasId: (id) => set({ currentCanvasId: id }),
  setCurrentCanvasTitle: (title) => set({ currentCanvasTitle: title }),
  setAutoSave: (enabled) => set({ autoSaveEnabled: enabled }),

  saveCanvas: async () => {
    const { canvas, currentCanvasId, currentCanvasTitle } = get();
    if (!canvas) return;

    set({ isSaving: true });

    try {
      const fabricData = JSON.stringify(canvas.toJSON());
      const thumbnail = canvas.toDataURL({ format: "png", quality: 0.5 });

      const response = await fetch(
        currentCanvasId ? `/api/canvas/${currentCanvasId}` : "/api/canvas",
        {
          method: currentCanvasId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: currentCanvasTitle,
            fabricData,
            thumbnail,
            width: canvas.width,
            height: canvas.height,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save canvas");

      const data = await response.json();
      const canvasId = data.id;

      // Save version history (for existing canvases)
      if (currentCanvasId) {
        await fetch(`/api/canvas/${currentCanvasId}/history`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fabricData }),
        }).catch((error) => {
          console.error("Error saving version:", error);
          // Don't fail the save if version history fails
        });
      }

      set({
        currentCanvasId: canvasId,
        lastSaved: new Date(),
      });
    } catch (error) {
      console.error("Error saving canvas:", error);
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  loadCanvas: async (id) => {
    const { canvas } = get();
    if (!canvas) return;

    try {
      const response = await fetch(`/api/canvas/${id}`);
      if (!response.ok) throw new Error("Failed to load canvas");

      const data = await response.json();

      // Clear current canvas
      canvas.clear();

      // Load canvas data
      canvas.loadFromJSON(JSON.parse(data.fabricData), () => {
        canvas.renderAll();
        set({
          currentCanvasId: data.id,
          currentCanvasTitle: data.title,
          lastSaved: new Date(data.updatedAt),
        });
      });
    } catch (error) {
      console.error("Error loading canvas:", error);
      throw error;
    }
  },

  createNewCanvas: async () => {
    const { canvas } = get();
    if (!canvas) return;

    canvas.clear();
    set({
      currentCanvasId: null,
      currentCanvasTitle: "Untitled Canvas",
      lastSaved: null,
    });
  },

  // Clear
  clearCanvas: () => {
    const canvas = get().canvas;
    if (canvas) {
      canvas.clear();
    }
  },
}));

