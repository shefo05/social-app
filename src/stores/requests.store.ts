import { create } from "zustand";

interface RequestsState {
  incomingCount: number;
  setIncomingCount: (count: number) => void;
  incrementIncoming: () => void;
  decrementIncoming: () => void;
}

export const useRequestsStore = create<RequestsState>((set) => ({
  incomingCount: 0,
  setIncomingCount: (count) => set({ incomingCount: count }),
  incrementIncoming: () =>
    set((state) => ({ incomingCount: state.incomingCount + 1 })),
  decrementIncoming: () =>
    set((state) => ({ incomingCount: Math.max(0, state.incomingCount - 1) })),
}));
