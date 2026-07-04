import { io, type Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://social-app-5f5n.onrender.com";

let socket: Socket | null = null;

/**
 * Connection-lifecycle singleton only. The backend's RealtimeGateway
 * (src/common/realtime-gateway/realtime.gateway.ts) currently has no
 * `io.use()` auth middleware and no real event handlers beyond
 * connect/disconnect logging - there's no server-side contract to build
 * feature listeners against yet. Sends the JWT via the standard `auth`
 * handshake object so the client is ready the moment the backend adds
 * real verification; don't attach feature-specific event handlers until
 * that contract exists server-side.
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
