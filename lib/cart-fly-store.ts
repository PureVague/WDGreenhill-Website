import { create } from "zustand";

export interface FlyPayload {
  id: string;
  imageUrl: string;
  fromRect: { x: number; y: number; width: number; height: number };
}

interface CartFlyState {
  items: FlyPayload[];
  launch: (payload: Omit<FlyPayload, "id">) => void;
  remove: (id: string) => void;
}

export const useCartFlyStore = create<CartFlyState>((set) => ({
  items: [],
  launch: (payload) =>
    set((s) => ({
      items: [...s.items, { ...payload, id: crypto.randomUUID() }],
    })),
  remove: (id) => set((s) => ({ items: s.items.filter((f) => f.id !== id) })),
}));
