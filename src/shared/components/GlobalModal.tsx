import { useEffect } from 'react'; // 1. useEffect 불러오기
import { createPortal } from 'react-dom';

import { useModalStore } from '../../store/useModalStore';

export const GlobalModal = () => {
  const { closeModal, content, isOpen } = useModalStore();

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscKey);
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div className="relative z-50" onClick={(e) => e.stopPropagation()}>
        {content}
      </div>
    </div>,
    document.body,
  );
};
