import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  loadingProgress: number;
  activeSection: number;
  isCinematicMode: boolean;
  isSecretMode: boolean;
  isChatOpen: boolean;
  cursorPosition: { x: number; y: number };
  setLoading: (v: boolean) => void;
  setLoadingProgress: (v: number) => void;
  setActiveSection: (v: number) => void;
  toggleCinematicMode: () => void;
  toggleSecretMode: () => void;
  toggleChat: () => void;
  setCursorPosition: (x: number, y: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: true,
  loadingProgress: 0,
  activeSection: 0,
  isCinematicMode: false,
  isSecretMode: false,
  isChatOpen: false,
  cursorPosition: { x: 0, y: 0 },
  setLoading: (v) => set({ isLoading: v }),
  setLoadingProgress: (v) => set({ loadingProgress: v }),
  setActiveSection: (v) => set({ activeSection: v }),
  toggleCinematicMode: () => set((s) => ({ isCinematicMode: !s.isCinematicMode })),
  toggleSecretMode: () => set((s) => ({ isSecretMode: !s.isSecretMode })),
  toggleChat: () => set((s) => ({ isChatOpen: !s.isChatOpen })),
  setCursorPosition: (x, y) => set({ cursorPosition: { x, y } }),
}));
