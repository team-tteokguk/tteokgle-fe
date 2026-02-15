import type { ReactNode } from 'react';

import { create } from 'zustand';

interface ModalStore {
  closeModal: () => void;
  content: null | ReactNode;
  isOpen: boolean;
  openModal: (content: ReactNode) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  closeModal: () => set({ content: null, isOpen: false }),
  content: null,
  isOpen: false,
  openModal: (content) => set({ content, isOpen: true }),
}));
