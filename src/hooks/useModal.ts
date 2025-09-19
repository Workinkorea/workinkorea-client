'use client';

import { create } from 'zustand';

interface ModalStore {
  openModals: Set<string>;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  isOpen: (id: string) => boolean;
}

const useModalStore = create<ModalStore>((set, get) => ({
  openModals: new Set(),
  openModal: (id: string) => {
    set((state) => ({
      openModals: new Set(state.openModals).add(id)
    }));
  },
  closeModal: (id: string) => {
    set((state) => {
      const newSet = new Set(state.openModals);
      newSet.delete(id);
      return { openModals: newSet };
    });
  },
  isOpen: (id: string) => {
    return get().openModals.has(id);
  }
}));

export const useModal = (id: string) => {
  const { openModal, closeModal, isOpen } = useModalStore();

  return {
    isOpen: isOpen(id),
    open: () => openModal(id),
    close: () => closeModal(id),
  };
};