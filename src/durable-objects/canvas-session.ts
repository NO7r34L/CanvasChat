/**
 * Canvas Session Durable Object
 * Manages real-time collaboration for a single canvas using WebSockets
 */

interface Session {
  webSocket: WebSocket;
  userId: string;
  userName: string;
  quit: boolean;
}

interface CursorPosition {
  x: number;
  y: number;
  userId: string;
  userName: string;
}

interface CanvasEvent {
  type: "object:added" | "object:modified" | "object:removed" | "cursor:move" | "user:joined" | "user:left";
  userId: string;
  userName?: string;
  data?: any;
  position?: { x: number; y: number };
}

export class CanvasSession implements DurableObject {
  private state: DurableObjectState;
  private sessions: Map<string, Session>;
  private cursors: Map<string, CursorPosition>;

  constructor(state: DurableObjectState, env: unknown) {
    this.state = state;
    this.sessions = new Map();
    this.cursors = new Map();
  }

  async fetch(request: Request) {
    const url = new URL(request.url);

    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket", { status: 400 });
    }

    // Get user info from query params
    const userId = url.searchParams.get("userId");
    const userName = url.searchParams.get("userName") || "Anonymous";

    if (!userId) {
      return new Response("Missing userId", { status: 400 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    await this.handleSession(server, userId, userName);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async handleSession(webSocket: WebSocket, userId: string, userName: string) {
    webSocket.accept();

    const session: Session = {
      webSocket,
      userId,
      userName,
      quit: false,
    };

    this.sessions.set(userId, session);

    // Notify others of new user
    this.broadcast(
      {
        type: "user:joined",
        userId,
        userName,
      },
      userId
    );

    // Send current cursors to new user
    const currentCursors = Array.from(this.cursors.values());
    webSocket.send(
      JSON.stringify({
        type: "cursors:init",
        cursors: currentCursors,
      })
    );

    webSocket.addEventListener("message", async (event) => {
      try {
        if (session.quit) return;

        const message: CanvasEvent = JSON.parse(event.data as string);

        // Update cursor position
        if (message.type === "cursor:move" && message.position) {
          this.cursors.set(userId, {
            x: message.position.x,
            y: message.position.y,
            userId,
            userName,
          });
        }

        // Broadcast to all other users
        this.broadcast(
          {
            ...message,
            userId,
            userName,
          },
          userId
        );
      } catch (error) {
        console.error("Error handling message:", error);
      }
    });

    webSocket.addEventListener("close", () => {
      session.quit = true;
      this.sessions.delete(userId);
      this.cursors.delete(userId);

      // Notify others of user leaving
      this.broadcast({
        type: "user:left",
        userId,
      });
    });

    webSocket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
      session.quit = true;
      this.sessions.delete(userId);
      this.cursors.delete(userId);
    });
  }

  broadcast(message: CanvasEvent, excludeUserId?: string) {
    const messageStr = JSON.stringify(message);

    for (const [userId, session] of this.sessions) {
      if (userId === excludeUserId) continue;
      if (session.quit) continue;

      try {
        session.webSocket.send(messageStr);
      } catch (error) {
        console.error("Error broadcasting to session:", error);
        session.quit = true;
        this.sessions.delete(userId);
      }
    }
  }
}

