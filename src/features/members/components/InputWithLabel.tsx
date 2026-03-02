import { useEffect, useState } from 'react';

import pencilIcon from '../../../shared/assets/icons/pencil.png';

interface InputWithLabelProps {
  defaultValue: string;
  disabled?: boolean;
  errorMessage?: string;
  icon?: string;
  id: string;
  label: string;
  onSave: (value: string) => Promise<void> | void;
  placeholder?: string;
}

export const InputWithLabel = ({
  defaultValue,
  disabled = false,
  errorMessage,
  icon,
  id,
  label,
  onSave,
  placeholder,
}: InputWithLabelProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const onClickEditButton = () => {
    if (disabled || isSubmitting) return;
    setIsEdit(!isEdit);
  };

  const onCancleButton = () => {
    if (isSubmitting) return;
    setIsEdit(!isEdit);
    setInputValue(defaultValue);
  };

  const onClickSaveButton = async () => {
    if (isSubmitting || disabled) return;

    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    try {
      setIsSubmitting(true);
      await onSave(trimmedValue);
      setIsEdit(false);
    } catch (_error) {
      // 실패 시 편집 모드를 유지하여 사용자가 즉시 값을 수정할 수 있게 한다.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-font-main flex flex-col gap-2 font-bold">
      <label className="flex items-center gap-2 text-sm leading-5 tracking-[-0.15px]" htmlFor={id}>
        {icon && <img alt={icon} className="h-4 w-4" src={icon} />}
        {label}
      </label>
      {!isEdit ? (
        <div className="bg-white-dark border-white-dark flex w-full items-center rounded-2xl border-2">
          <input
            className="w-full px-4 py-3 text-base leading-6 tracking-[-0.312px]"
            id={id}
            readOnly
            type="text"
            value={defaultValue || ''}
          />
          <button
            aria-label="edit-button"
            disabled={disabled || isSubmitting}
            onClick={onClickEditButton}
            type="button"
          >
            <img alt="pencil-icon" className="w-4.5" src={pencilIcon} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            className="border-brand-main w-full rounded-2xl border-2 px-4 py-3 text-base leading-6 tracking-[-0.312px]"
            onChange={(event) => setInputValue(event.target.value)}
            placeholder={placeholder}
            type="text"
            value={inputValue}
          />
          <button
            className="bg-brand-main edit-button-base text-white disabled:bg-gray-300"
            disabled={disabled || isSubmitting || inputValue.trim().length === 0}
            onClick={() => void onClickSaveButton()}
            type="button"
          >
            저장
          </button>
          <button
            className="edit-button-base bg-disabled text-font-gray"
            disabled={isSubmitting}
            onClick={onCancleButton}
            type="button"
          >
            취소
          </button>
        </div>
      )}
      <p className="min-h-5 text-sm leading-5 text-red-500">{errorMessage ?? ''}</p>
    </div>
  );
};
