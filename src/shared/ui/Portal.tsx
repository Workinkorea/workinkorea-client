'use client';

import { type ReactNode, useState, useEffect } from "react";
import { createPortal } from "react-dom";

export const Portal = ({ children }: { children: ReactNode }) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setModalRoot(document.getElementById('modal-root'));
  }, []);

  if (!modalRoot) {
    return null;
  }

  return createPortal(children, modalRoot);
};
