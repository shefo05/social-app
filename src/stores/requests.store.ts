import { create } from "zustand";

interface RequestsState {
  incomingCount: number;
  setIncomingCount: (count: number) => void;
  decrementIncoming: () => void;
}

export const useRequestsStore = create<RequestsState>((set) => ({
  incomingCount: 0,
  setIncomingCount: (count) => set({ incomingCount: count }),
  decrementIncoming: () =>
    set((state) => ({ incomingCount: Math.max(0, state.incomingCount - 1) })),
}));
