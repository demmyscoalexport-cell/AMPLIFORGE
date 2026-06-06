import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  upgradeOpen: boolean;
  toggleSidebar: () => void;
  setCommandOpen: (v: boolean) => void;
  setUpgradeOpen: (v: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      commandOpen: false,
      upgradeOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setCommandOpen: (v) => set({ commandOpen: v }),
      setUpgradeOpen: (v) => set({ upgradeOpen: v }),
    }),
    { name: "ampliforge-ui", partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }) }
  )
);
