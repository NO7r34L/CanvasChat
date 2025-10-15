import anime from "animejs";
import type { Canvas, Object as FabricObject } from "fabric";

/**
 * Canvas animation utilities using Anime.js
 * Provides smooth animations for canvas objects
 */

interface AnimationOptions {
  duration?: number;
  easing?: string;
  delay?: number;
  direction?: "normal" | "reverse" | "alternate";
}

/**
 * Animate object position
 */
export function animatePosition(
  obj: FabricObject,
  canvas: Canvas,
  targetX: number,
  targetY: number,
  options: AnimationOptions = {}
) {
  const { duration = 300, easing = "easeOutQuad", delay = 0 } = options;

  anime({
    targets: obj,
    left: targetX,
    top: targetY,
    duration,
    easing,
    delay,
    update: () => {
      canvas.requestRenderAll();
    },
  });
}

/**
 * Animate object scale
 */
export function animateScale(
  obj: FabricObject,
  canvas: Canvas,
  targetScale: number,
  options: AnimationOptions = {}
) {
  const { duration = 300, easing = "easeOutElastic(1, .8)", delay = 0 } = options;

  anime({
    targets: obj,
    scaleX: targetScale,
    scaleY: targetScale,
    duration,
    easing,
    delay,
    update: () => {
      canvas.requestRenderAll();
    },
  });
}

/**
 * Animate object rotation
 */
export function animateRotation(
  obj: FabricObject,
  canvas: Canvas,
  targetAngle: number,
  options: AnimationOptions = {}
) {
  const { duration = 300, easing = "easeInOutQuad", delay = 0 } = options;

  anime({
    targets: obj,
    angle: targetAngle,
    duration,
    easing,
    delay,
    update: () => {
      canvas.requestRenderAll();
    },
  });
}

/**
 * Animate object opacity (fade in/out)
 */
export function animateOpacity(
  obj: FabricObject,
  canvas: Canvas,
  targetOpacity: number,
  options: AnimationOptions = {}
) {
  const { duration = 300, easing = "linear", delay = 0 } = options;

  anime({
    targets: obj,
    opacity: targetOpacity,
    duration,
    easing,
    delay,
    update: () => {
      canvas.requestRenderAll();
    },
  });
}

/**
 * Pulse animation (scale up and down)
 */
export function animatePulse(
  obj: FabricObject,
  canvas: Canvas,
  options: AnimationOptions = {}
) {
  const { duration = 600, delay = 0 } = options;

  const originalScaleX = obj.scaleX || 1;
  const originalScaleY = obj.scaleY || 1;

  anime({
    targets: obj,
    scaleX: [originalScaleX, originalScaleX * 1.2, originalScaleX],
    scaleY: [originalScaleY, originalScaleY * 1.2, originalScaleY],
    duration,
    easing: "easeInOutQuad",
    delay,
    update: () => {
      canvas.requestRenderAll();
    },
  });
}

/**
 * Bounce animation (vertical movement)
 */
export function animateBounce(
  obj: FabricObject,
  canvas: Canvas,
  bounceHeight: number = 50,
  options: AnimationOptions = {}
) {
  const { duration = 600, delay = 0 } = options;

  const originalTop = obj.top || 0;

  anime({
    targets: obj,
    top: [
      { value: originalTop - bounceHeight, duration: duration / 3 },
      { value: originalTop, duration: (duration * 2) / 3 },
    ],
    easing: "easeOutBounce",
    delay,
    update: () => {
      canvas.requestRenderAll();
    },
  });
}

/**
 * Shake animation (horizontal)
 */
export function animateShake(
  obj: FabricObject,
  canvas: Canvas,
  intensity: number = 10,
  options: AnimationOptions = {}
) {
  const { duration = 400, delay = 0 } = options;

  const originalLeft = obj.left || 0;

  anime({
    targets: obj,
    left: [
      originalLeft - intensity,
      originalLeft + intensity,
      originalLeft - intensity,
      originalLeft + intensity,
      originalLeft,
    ],
    duration,
    easing: "easeInOutSine",
    delay,
    update: () => {
      canvas.requestRenderAll();
    },
  });
}

/**
 * Fade in with scale (entrance animation)
 */
export function animateFadeInScale(
  obj: FabricObject,
  canvas: Canvas,
  options: AnimationOptions = {}
) {
  const { duration = 400, easing = "easeOutBack", delay = 0 } = options;

  obj.opacity = 0;
  obj.scaleX = 0;
  obj.scaleY = 0;

  anime({
    targets: obj,
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
    duration,
    easing,
    delay,
    update: () => {
      canvas.requestRenderAll();
    },
  });
}

/**
 * Fade out with scale (exit animation)
 */
export function animateFadeOutScale(
  obj: FabricObject,
  canvas: Canvas,
  options: AnimationOptions = {}
) {
  const { duration = 400, easing = "easeInBack", delay = 0 } = options;

  return anime({
    targets: obj,
    opacity: 0,
    scaleX: 0,
    scaleY: 0,
    duration,
    easing,
    delay,
    update: () => {
      canvas.requestRenderAll();
    },
    complete: () => {
      canvas.remove(obj);
      canvas.requestRenderAll();
    },
  });
}

/**
 * Morph animation (for paths)
 */
export function animatePath(
  obj: FabricObject,
  canvas: Canvas,
  options: AnimationOptions = {}
) {
  const { duration = 1000, easing = "easeInOutQuad", delay = 0 } = options;

  anime({
    targets: obj,
    strokeDashoffset: [anime.setDashoffset, 0],
    duration,
    easing,
    delay,
    update: () => {
      canvas.requestRenderAll();
    },
  });
}

/**
 * Sequential animation for multiple objects
 */
export function animateSequence(
  objects: FabricObject[],
  canvas: Canvas,
  animationFn: (obj: FabricObject, canvas: Canvas, index: number) => void,
  stagger: number = 100
) {
  objects.forEach((obj, index) => {
    setTimeout(() => {
      animationFn(obj, canvas, index);
    }, index * stagger);
  });
}

/**
 * Timeline animation (complex multi-step animations)
 */
export function createTimeline() {
  return anime.timeline({
    easing: "easeOutExpo",
    duration: 750,
  });
}

/**
 * Export canvas as PNG blob
 */
export async function exportCanvasAsPNG(canvas: Canvas): Promise<Blob> {
  const dataUrl = canvas.toDataURL({ format: "png", quality: 1 } as any);
  const response = await fetch(dataUrl);
  return response.blob();
}

/**
 * Export canvas as SVG string
 */
export function exportCanvasAsSVG(canvas: Canvas): string {
  return canvas.toSVG();
}

/**
 * Export canvas as JSON string
 */
export function exportCanvasAsJSON(canvas: Canvas): string {
  return JSON.stringify(canvas.toJSON());
}

/**
 * Download canvas as file
 */
export function downloadCanvas(
  blob: Blob,
  filename: string,
  format: "png" | "svg" | "json"
) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

