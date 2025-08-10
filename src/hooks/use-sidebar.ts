import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SidebarSettings = { disabled: boolean; isHoverOpen: boolean };
type SidebarStore = {
  isOpen: boolean;
  isHover: boolean;
  // Keep sidebar expanded when interactive overlays (e.g., dropdowns) are open
  hoverLock: boolean;
  settings: SidebarSettings;
  toggleOpen: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsHover: (isHover: boolean) => void;
  setHoverLock: (locked: boolean) => void;
  getOpenState: () => boolean;
  setSettings: (settings: Partial<SidebarSettings>) => void;
};

export const useSidebar = create(
  persist<SidebarStore>(
    (set, get) => ({
      isOpen: false,
      isHover: false,
      hoverLock: false,
      settings: { disabled: false, isHoverOpen: true },
      toggleOpen: () => {
        set({ isOpen: !get().isOpen });
      },
      setIsOpen: (isOpen: boolean) => {
        set({ isOpen });
      },
      setIsHover: (isHover: boolean) => {
        set({ isHover });
      },
      setHoverLock: (locked: boolean) => {
        set({ hoverLock: locked });
      },
      getOpenState: () => {
        const state = get();
        // Sidebar is considered open if: manually opened OR (hover-open enabled and hovering) OR temporarily locked by an open overlay
        return state.isOpen || (state.settings.isHoverOpen && state.isHover) || state.hoverLock;
      },
      setSettings: (settings: Partial<SidebarSettings>) => {
        set((state) => ({ settings: { ...state.settings, ...settings } }));
      },
    }),
    {
      name: 'sidebar:v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
