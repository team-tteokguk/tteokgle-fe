import { useState } from 'react';

import trashcanIcon from '../../../shared/assets/icons/trashcan-red.png';
import { useModalStore } from '../../../store/useModalStore';

interface ConfirmModalProps {
  confirmText?: string;
  description?: string;
  onConfirm: () => Promise<void> | void;
  title?: string;
}

export const ConfirmModal = ({
  confirmText = '탈퇴하기',
  description = '탈퇴하시면 모든 데이터가 삭제되며\n 복구할 수 없습니다.',
  onConfirm,
  title = '회원 탈퇴',
}: ConfirmModalProps) => {
  const { closeModal } = useModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onConfirm();
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-[min(384px,94vw)] flex-col items-center rounded-4xl bg-white p-6 shadow-2xl">
      <div className="bg-alarm-second mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <img alt="trashcan-icon" className="w-8" src={trashcanIcon} />
      </div>
      <h2 className="text-font-main mb-2 text-[20px] leading-7 font-bold tracking-[-0.449px]">
        {title}
      </h2>
      <span className="text-font-gray mb-6 text-[14px] leading-5 tracking-[-0.15px] whitespace-pre-line">
        {description}
      </span>
      <div className="flex w-full gap-2">
        <button
          className="text-font-gray-dark bg-disabled w-full rounded-2xl py-3 leading-6 font-bold tracking-[-0.312px]"
          onClick={closeModal}
          type="button"
        >
          취소
        </button>
        <button
          className="bg-warning w-full rounded-2xl py-3 leading-6 font-bold tracking-[-0.312px] text-white disabled:opacity-70"
          disabled={isSubmitting}
          onClick={() => void handleConfirm()}
          type="button"
        >
          {isSubmitting ? '처리 중...' : confirmText}
        </button>
      </div>
    </div>
  );
};
