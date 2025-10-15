"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import type { SelectComment } from "@/lib/db/schema";

interface CanvasCommentProps {
  comment: SelectComment;
  onDelete?: (id: number) => void;
}

export function CanvasComment({ comment, onDelete }: CanvasCommentProps) {
  return (
    <Card
      className="absolute w-64 bg-yellow-50 p-3 shadow-lg"
      style={{
        left: comment.positionX || 0,
        top: comment.positionY || 0,
      }}
    >
      <div className="flex items-start gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-xs text-primary-foreground">
            U
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">User</p>
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onDelete(comment.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <p className="mt-1 text-sm">{comment.content}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </Card>
  );
}

interface CommentInputProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  position: { x: number; y: number };
}

export function CommentInput({ onSubmit, onCancel, position }: CommentInputProps) {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <Card
      className="absolute w-64 bg-white p-3 shadow-lg"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">Add Comment</p>
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your comment..."
          className="min-h-[80px] resize-none text-sm"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!content.trim()}
          >
            <Send className="mr-1 h-3 w-3" />
            Post
          </Button>
        </div>
      </div>
    </Card>
  );
}

