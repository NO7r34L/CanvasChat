import { useState, useEffect, useCallback } from "react";
import type { Canvas, Object as FabricObject } from "fabric";
import { useCanvasStore } from "@/stores/canvas-store";

interface CursorPosition {
  x: number;
  y: number;
  userId: string;
  userName: string;
}

interface UseCanvasCollaborationOptions {
  canvasId: number;
  userId: string;
  userName: string;
}

export function useCanvasCollaboration({
  canvasId,
  userId,
  userName,
}: UseCanvasCollaborationOptions) {
  const { canvas } = useCanvasStore();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [cursors, setCursors] = useState<Map<string, CursorPosition>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  // Initialize WebSocket connection
  useEffect(() => {
    if (!canvas || !canvasId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/api/canvas/${canvasId}/collab?userId=${userId}&userName=${encodeURIComponent(userName)}`;

    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log("Connected to collaboration session");
      setIsConnected(true);
    };

    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case "cursors:init":
            // Initialize cursors from existing users
            const cursorMap = new Map<string, CursorPosition>();
            message.cursors.forEach((cursor: CursorPosition) => {
              cursorMap.set(cursor.userId, cursor);
            });
            setCursors(cursorMap);
            break;

          case "cursor:move":
            if (message.userId !== userId && message.position) {
              setCursors((prev) => {
                const newCursors = new Map(prev);
                newCursors.set(message.userId, {
                  x: message.position.x,
                  y: message.position.y,
                  userId: message.userId,
                  userName: message.userName || "User",
                });
                return newCursors;
              });
            }
            break;

          case "object:added":
          case "object:modified":
            if (message.userId !== userId && message.data) {
              // Update canvas object from remote user
              canvas.renderAll();
            }
            break;

          case "object:removed":
            if (message.userId !== userId) {
              // Remove object from canvas
              canvas.renderAll();
            }
            break;

          case "user:joined":
            if (message.userId !== userId) {
              setOnlineUsers((prev) => new Set(prev).add(message.userId));
            }
            break;

          case "user:left":
            if (message.userId !== userId) {
              setOnlineUsers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(message.userId);
                return newSet;
              });
              setCursors((prev) => {
                const newCursors = new Map(prev);
                newCursors.delete(message.userId);
                return newCursors;
              });
            }
            break;
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    };

    websocket.onclose = () => {
      console.log("Disconnected from collaboration session");
      setIsConnected(false);
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [canvas, canvasId, userId, userName]);

  // Send canvas events to other users
  useEffect(() => {
    if (!canvas || !ws || !isConnected) return;

    const handleObjectModified = (e: any) => {
      if (e.target) {
        ws.send(
          JSON.stringify({
            type: "object:modified",
            data: e.target.toJSON(),
          })
        );
      }
    };

    const handleObjectAdded = (e: any) => {
      if (e.target) {
        ws.send(
          JSON.stringify({
            type: "object:added",
            data: e.target.toJSON(),
          })
        );
      }
    };

    const handleObjectRemoved = (e: any) => {
      if (e.target) {
        ws.send(
          JSON.stringify({
            type: "object:removed",
            data: { id: e.target.id },
          })
        );
      }
    };

    canvas.on("object:modified", handleObjectModified);
    canvas.on("object:added", handleObjectAdded);
    canvas.on("object:removed", handleObjectRemoved);

    return () => {
      canvas.off("object:modified", handleObjectModified);
      canvas.off("object:added", handleObjectAdded);
      canvas.off("object:removed", handleObjectRemoved);
    };
  }, [canvas, ws, isConnected]);

  // Send cursor position
  const sendCursorPosition = useCallback(
    (x: number, y: number) => {
      if (ws && isConnected) {
        ws.send(
          JSON.stringify({
            type: "cursor:move",
            position: { x, y },
          })
        );
      }
    },
    [ws, isConnected]
  );

  return {
    cursors,
    isConnected,
    onlineUsers,
    sendCursorPosition,
  };
}

