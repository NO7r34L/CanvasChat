"use client";

import { useState } from "react";
import anime from "animejs";
import { Play, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCanvasStore } from "@/stores/canvas-store";
import { useAnimationsStore, type Keyframe } from "@/stores/animations-store";

const EASING_OPTIONS = [
  "linear",
  "easeInQuad",
  "easeOutQuad",
  "easeInOutQuad",
  "easeInCubic",
  "easeOutCubic",
  "easeInOutCubic",
  "easeInElastic",
  "easeOutElastic",
  "easeInOutElastic",
  "easeInBounce",
  "easeOutBounce",
  "easeInOutBounce",
];

export function AnimationBuilder() {
  const [open, setOpen] = useState(false);
  const [animationName, setAnimationName] = useState("");
  const [duration, setDuration] = useState(1000);
  const [easing, setEasing] = useState("easeInOutQuad");
  const [keyframes, setKeyframes] = useState<Keyframe[]>([
    { time: 0, properties: {} },
    { time: 100, properties: {} },
  ]);

  const { canvas, selectedObject } = useCanvasStore();
  const { addAnimation } = useAnimationsStore();

  const addKeyframe = () => {
    const newKeyframe: Keyframe = {
      time: 50,
      properties: {},
    };
    setKeyframes([...keyframes, newKeyframe].sort((a, b) => a.time - b.time));
  };

  const removeKeyframe = (index: number) => {
    if (keyframes.length > 2) {
      setKeyframes(keyframes.filter((_, i) => i !== index));
    }
  };

  const updateKeyframe = (index: number, updates: Partial<Keyframe>) => {
    const updated = [...keyframes];
    updated[index] = { ...updated[index], ...updates };
    setKeyframes(updated);
  };

  const previewAnimation = () => {
    if (!canvas || !selectedObject) return;

    // Build anime.js timeline from keyframes
    const timeline = anime.timeline({
      duration,
      easing,
      autoplay: true,
    });

    keyframes.forEach((keyframe, index) => {
      if (index === 0) return; // Skip first keyframe (initial state)

      const targets: any = {
        targets: selectedObject,
      };

      if (keyframe.properties.x !== undefined) {
        targets.left = keyframe.properties.x;
      }
      if (keyframe.properties.y !== undefined) {
        targets.top = keyframe.properties.y;
      }
      if (keyframe.properties.scaleX !== undefined) {
        targets.scaleX = keyframe.properties.scaleX;
      }
      if (keyframe.properties.scaleY !== undefined) {
        targets.scaleY = keyframe.properties.scaleY;
      }
      if (keyframe.properties.angle !== undefined) {
        targets.angle = keyframe.properties.angle;
      }
      if (keyframe.properties.opacity !== undefined) {
        targets.opacity = keyframe.properties.opacity;
      }

      targets.update = () => canvas.renderAll();

      timeline.add(targets, (keyframe.time / 100) * duration);
    });
  };

  const saveAnimation = () => {
    if (!animationName.trim()) return;

    addAnimation({
      name: animationName,
      duration,
      easing,
      keyframes,
    });

    setOpen(false);
    setAnimationName("");
    setKeyframes([
      { time: 0, properties: {} },
      { time: 100, properties: {} },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={!selectedObject}>
          <Plus className="mr-2 h-4 w-4" />
          Custom Animation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Animation Builder</DialogTitle>
          <DialogDescription>
            Create custom animations with keyframes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Animation Settings */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="anim-name">Animation Name</Label>
              <Input
                id="anim-name"
                value={animationName}
                onChange={(e) => setAnimationName(e.target.value)}
                placeholder="My Animation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="easing">Easing</Label>
              <Select value={easing} onValueChange={setEasing}>
                <SelectTrigger id="easing">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EASING_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Duration: {duration}ms</Label>
            </div>
            <Slider
              value={[duration]}
              onValueChange={([value]) => setDuration(value)}
              min={100}
              max={3000}
              step={100}
            />
          </div>

          {/* Keyframes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Keyframes</Label>
              <Button size="sm" variant="outline" onClick={addKeyframe}>
                <Plus className="mr-1 h-3 w-3" />
                Add Keyframe
              </Button>
            </div>

            <div className="max-h-60 space-y-2 overflow-y-auto">
              {keyframes.map((keyframe, index) => (
                <Card key={index}>
                  <CardHeader className="p-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        Keyframe {index + 1} ({keyframe.time}%)
                      </CardTitle>
                      {index > 0 && index < keyframes.length - 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeKeyframe(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-xs text-muted-foreground">
                      Configure transform properties
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Preview Button */}
          <Button
            onClick={previewAnimation}
            variant="secondary"
            className="w-full"
            disabled={!selectedObject}
          >
            <Play className="mr-2 h-4 w-4" />
            Preview Animation
          </Button>
        </div>

        <DialogFooter>
          <Button
            onClick={saveAnimation}
            disabled={!animationName.trim()}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Animation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

