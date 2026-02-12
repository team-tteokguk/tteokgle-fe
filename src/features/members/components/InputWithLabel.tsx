import { useState } from 'react';

import pencilIcon from '../../../shared/assets/icons/pencil.png';

export const InputWithLabel = ({
  defaultValue,
  icon,
  id,
  label,
}: {
  defaultValue: string;
  icon?: string;
  id: string;
  label: string;
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const onClickEditButton = () => {
    setIsEdit(!isEdit);
  };

  const onCancleButton = () => {
    setIsEdit(!isEdit);
    setInputValue(defaultValue);
  };

  const onClickSaveButton = () => {
    // TODO: 변경 API 호출
    setIsEdit(!isEdit);
  };

  return (
    <div className="text-font-main flex flex-col gap-2 font-bold">
      <label className="flex items-center gap-2 text-sm leading-5 tracking-[-0.15px]" htmlFor={id}>
        {icon && <img alt={icon} className="h-4 w-4" src={icon} />}
        {label}
      </label>
      {!isEdit ? (
        <div className="bg-white-dark flex w-full items-center rounded-2xl">
          <input
            className="w-full px-4 py-3 text-base leading-6 tracking-[-0.312px]"
            id={id}
            readOnly={!isEdit}
            type="text"
            value={defaultValue || ''}
          />
          <button aria-label="edit-button" onClick={onClickEditButton} type="button">
            <img alt="pencil-icon" className="w-4.5" src={pencilIcon} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            className="border-brand-main w-full rounded-2xl border-2 px-4 py-3 text-base leading-6 tracking-[-0.312px]"
            type="text"
            value={inputValue}
          />
          <button
            className="bg-brand-main edit-button-base text-white"
            onClick={onClickSaveButton}
            type="button"
          >
            저장
          </button>
          <button
            className="edit-button-base bg-disabled text-font-gray"
            onClick={onCancleButton}
            type="button"
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
};
