import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Animations Store
 * Manages user-created custom animations
 */

export interface Keyframe {
  time: number; // 0-100 percentage
  properties: {
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    angle?: number;
    opacity?: number;
  };
}

export interface CustomAnimation {
  id: string;
  name: string;
  duration: number;
  easing: string;
  keyframes: Keyframe[];
  createdAt: Date;
}

interface AnimationsStore {
  // Custom animations
  customAnimations: CustomAnimation[];
  
  // Actions
  addAnimation: (animation: Omit<CustomAnimation, "id" | "createdAt">) => void;
  removeAnimation: (id: string) => void;
  updateAnimation: (id: string, updates: Partial<CustomAnimation>) => void;
  getAnimation: (id: string) => CustomAnimation | undefined;
}

export const useAnimationsStore = create<AnimationsStore>()(
  persist(
    (set, get) => ({
      customAnimations: [],

      addAnimation: (animation) => {
        const newAnimation: CustomAnimation = {
          ...animation,
          id: `anim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
        };

        set((state) => ({
          customAnimations: [...state.customAnimations, newAnimation],
        }));
      },

      removeAnimation: (id) => {
        set((state) => ({
          customAnimations: state.customAnimations.filter((a) => a.id !== id),
        }));
      },

      updateAnimation: (id, updates) => {
        set((state) => ({
          customAnimations: state.customAnimations.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        }));
      },

      getAnimation: (id) => {
        return get().customAnimations.find((a) => a.id === id);
      },
    }),
    {
      name: "canvas-animations-storage",
    }
  )
);

