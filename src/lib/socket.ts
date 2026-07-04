import { io, type Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://social-app-5f5n.onrender.com";

let socket: Socket | null = null;

/**
 * Connection-lifecycle singleton. RealtimeGateway (backend) verifies the
 * JWT sent here via the `auth` handshake object (io.use middleware),
 * auto-joins `user:{userId}`, and lets clients join/leave `post:{postId}`
 * via the post:join/post:leave events. Feature listeners (comment:new,
 * reaction:new, request:new, request:accepted) are attached by the
 * components/hooks that care about them, all sharing this one socket.
 */
export function getSocket(): Socket {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket", "polling"],
  });

  return socket;
}

export function connectSocket(token: string | null) {
  const s = getSocket();
  s.auth = { token };
  if (!s.connected) s.connect();
  return s;
}

export function disconnectSocket() {
  socket?.disconnect();
}
