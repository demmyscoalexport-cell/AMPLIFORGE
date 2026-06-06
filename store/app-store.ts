import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  credits: number;
  creditsLimit: number;
  plan: "starter" | "pro" | "agency";
  setCredits: (n: number) => void;
  consumeCredits: (n: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      credits: 3420,
      creditsLimit: 5000,
      plan: "pro",
      setCredits: (n) => set({ credits: n }),
      consumeCredits: (n) => set((state) => ({ credits: Math.max(0, state.credits - n) })),
    }),
    { name: "ampliforge-app" }
  )
);
