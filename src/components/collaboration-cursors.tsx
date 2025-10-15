"use client";

import { motion } from "motion/react";
import { MousePointer2 } from "lucide-react";

interface CursorPosition {
  x: number;
  y: number;
  userId: string;
  userName: string;
}

interface CollaborationCursorsProps {
  cursors: Map<string, CursorPosition>;
}

const CURSOR_COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#FFA07A", // Light Salmon
  "#98D8C8", // Mint
  "#F7DC6F", // Yellow
  "#BB8FCE", // Purple
  "#85C1E2", // Sky Blue
];

function getCursorColor(userId: string): string {
  // Generate consistent color for userId
  const hash = userId.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
}

export function CollaborationCursors({ cursors }: CollaborationCursorsProps) {
  return (
    <>
      {Array.from(cursors.values()).map((cursor) => {
        const color = getCursorColor(cursor.userId);

        return (
          <motion.div
            key={cursor.userId}
            className="pointer-events-none absolute z-50"
            initial={{ x: cursor.x, y: cursor.y }}
            animate={{ x: cursor.x, y: cursor.y }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            style={{
              left: 0,
              top: 0,
            }}
          >
            {/* Cursor Icon */}
            <MousePointer2
              className="h-5 w-5 -translate-x-1 -translate-y-1"
              style={{ color }}
              fill={color}
            />

            {/* User Name Label */}
            <div
              className="ml-4 mt-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium text-white shadow-lg"
              style={{ backgroundColor: color }}
            >
              {cursor.userName}
            </div>
          </motion.div>
        );
      })}
    </>
  );
}

