import { create } from "zustand";

/**
 * Chat Store
 * Manages chat-related UI state (not the actual messages - that's handled by Assistant UI)
 * This is for UI preferences and ephemeral state
 */

interface ChatStore {
  // Chat preferences
  showTimestamps: boolean;
  showAvatars: boolean;
  compactMode: boolean;
  
  // Actions
  toggleTimestamps: () => void;
  toggleAvatars: () => void;
  toggleCompactMode: () => void;
  
  // Active thread (UI state only)
  selectedThreadId: string | null;
  setSelectedThreadId: (threadId: string | null) => void;
  
  // Input state
  inputValue: string;
  setInputValue: (value: string) => void;
  clearInput: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  // Preferences
  showTimestamps: true,
  showAvatars: true,
  compactMode: false,
  
  // Actions
  toggleTimestamps: () => set((state) => ({ showTimestamps: !state.showTimestamps })),
  toggleAvatars: () => set((state) => ({ showAvatars: !state.showAvatars })),
  toggleCompactMode: () => set((state) => ({ compactMode: !state.compactMode })),
  
  // Thread selection
  selectedThreadId: null,
  setSelectedThreadId: (threadId) => set({ selectedThreadId: threadId }),
  
  // Input
  inputValue: "",
  setInputValue: (value) => set({ inputValue: value }),
  clearInput: () => set({ inputValue: "" }),
}));

