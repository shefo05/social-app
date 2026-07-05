import { create } from "zustand";

interface PresenceState {
  /** userIds currently known to be online. Populated from the
   * GET /user/online-friends snapshot on socket connect/reconnect and
   * kept live via presence:online/offline - see AppShell.tsx. */
  onlineUserIds: Set<string>;
  setOnline: (userId: string) => void;
  setOffline: (userId: string) => void;
  setOnlineUserIds: (userIds: string[]) => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
  onlineUserIds: new Set(),
  setOnline: (userId) =>
    set((state) => ({ onlineUserIds: new Set(state.onlineUserIds).add(userId) })),
  setOffline: (userId) =>
    set((state) => {
      const next = new Set(state.onlineUserIds);
      next.delete(userId);
      return { onlineUserIds: next };
    }),
  setOnlineUserIds: (userIds) => set({ onlineUserIds: new Set(userIds) }),
}));
