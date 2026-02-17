import type { ChangeEvent, SyntheticEvent } from 'react';

import { useEffect, useRef, useState } from 'react';

import photoIcon from '../../../shared/assets/icons/photo.png';
import closeIcon from '../../../shared/assets/icons/x.png';
import { getAllGomyeongInfos } from '../../../shared/utils/itemUtils';
import { useModalStore } from '../../../store/useModalStore';
import { createImagePresignedUrl, uploadImageToPresignedUrl } from '../api/storeApi';
import { useCreateItem, useGetMyStore } from '../hooks/useStore';

const ALLOWED_IMAGE_TYPES = new Set(['image/gif', 'image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const CreateNewItemModal = () => {
  const { closeModal } = useModalStore();
  const { data: myStore } = useGetMyStore();
  const { mutateAsync: createItem } = useCreateItem(myStore?.id ?? '');
  const itemOptions = getAllGomyeongInfos();

  const [name, setName] = useState<string>(itemOptions[0]?.id ?? '');
  const [content, setContent] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [imageError, setImageError] = useState<null | string>(null);
  const [imageFileName, setImageFileName] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [count, setCount] = useState(1);
  const [submitError, setSubmitError] = useState<null | string>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const isDisabled =
    isSubmitting || !myStore?.id || content.trim().length === 0 || count < 1 || !name;

  const handleCountMinus = () => {
    setCount((prev) => Math.max(1, prev - 1));
  };

  const handleCountPlus = () => {
    setCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (!selectedImageFile) {
      setPreviewImageUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImageFile);
    setPreviewImageUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImageFile]);

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImageFileName('');
    setImageError(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedImageFile(null);
      setImageFileName('');
      setImageError(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setSelectedImageFile(null);
      setImageFileName('');
      setImageError('PNG, JPG, WEBP, GIF 이미지 파일만 업로드할 수 있습니다.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setSelectedImageFile(null);
      setImageFileName('');
      setImageError('이미지 용량은 최대 5MB까지 업로드할 수 있습니다.');
      event.target.value = '';
      return;
    }

    setSelectedImageFile(file);
    setImageFileName(file.name);
    setImageError(null);
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();

    if (!myStore?.id) {
      setSubmitError('상점 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (content.trim().length === 0) {
      setSubmitError('메시지를 입력해주세요.');
      return;
    }

    if (!name) {
      setSubmitError('고명 종류를 선택해주세요.');
      return;
    }

    if (imageError) {
      setSubmitError('이미지 파일을 다시 확인해주세요.');
      return;
    }

    const normalizedMediaUrl = mediaUrl.trim();
    const hasImage = !!selectedImageFile;

    if (hasImage && normalizedMediaUrl) {
      setSubmitError('사진 또는 동영상 중 하나만 추가해주세요.');
      return;
    }

    let contentType: 'NONE' | 'PHOTO' | 'VIDEO' = 'NONE';
    if (hasImage) contentType = 'PHOTO';
    if (normalizedMediaUrl) contentType = 'VIDEO';

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      let imageUrl: null | string = null;

      if (selectedImageFile) {
        const presign = await createImagePresignedUrl({
          contentType: selectedImageFile.type,
          fileName: selectedImageFile.name,
        });

        await uploadImageToPresignedUrl(
          presign.uploadUrl,
          selectedImageFile,
          selectedImageFile.type,
        );
        imageUrl = presign.fileUrl;
      }

      const body = {
        content: content.trim(),
        contentType,
        imageUrl,
        mediaUrl: normalizedMediaUrl || null,
        name,
      };

      for (let i = 0; i < count; i += 1) {
        await createItem(body);
      }

      closeModal();
    } catch (_error) {
      setSubmitError('고명 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bottom-sheet flex h-[85vh] max-h-204.75 w-full max-w-md flex-col overflow-hidden">
      <div className="border-disabled sticky top-0 left-0 z-10 flex w-full items-center justify-between border-b bg-white px-6 py-6.5">
        <h2 className="text-font-main text-xl leading-7 font-bold tracking-[-0.449px]">
          고명 등록하기
        </h2>
        <button aria-label="close" onClick={closeModal} type="button">
          <img alt="close-icon" className="w-5" src={closeIcon} />
        </button>
      </div>
      <form
        className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6 px-6 pb-32.25"
        onSubmit={handleSubmit}
      >
        <div>
          <h3 className="heading3-text mb-3">고명 종류 선택</h3>
          <ul className="grid grid-cols-5 gap-2">
            {itemOptions.map((item) => (
              <li key={item.id}>
                <button
                  aria-pressed={name === item.id}
                  className="bg-font-white aria-pressed:bg-grad-accent flex aspect-square w-[71.4px] flex-col items-center justify-center gap-1 rounded-2xl"
                  onClick={() => setName(item.id)}
                  type="button"
                >
                  <span className="text-2xl leading-8 tracking-[0.07px]">{item.emoji}</span>
                  <span className="text-[10px] leading-3.75 font-medium tracking-[0.117px]">
                    {item.nameKR}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="heading3-text">고명 속에 숨길 메세지</h3>
          <textarea
            className="border-disabled h-24 resize-none rounded-2xl border-2 px-4 py-3 text-base leading-6 tracking-[-0.312px]"
            id="message"
            maxLength={100}
            name="message"
            onChange={(e) => setContent(e.target.value)}
            value={content}
          ></textarea>
          <p className="text-font-gray-light ml-auto text-xs leading-4">{content.length}/100</p>
        </div>
        <div>
          <h3 className="heading3-text mb-3">이미지 추가 (선택)</h3>
          <label
            className="border-font-gray-extra-light bg-white-dark text-font-gray flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 py-3.5 text-base leading-6 tracking-[-0.312px]"
            htmlFor="item-image"
          >
            <img alt="photo-icon" className="w-5" src={photoIcon} />
            이미지 파일을 선택하세요
          </label>
          <input
            accept="image/png, image/jpeg, image/webp, image/gif"
            className="hidden"
            id="item-image"
            onChange={handleImageChange}
            ref={imageInputRef}
            type="file"
          />
          {imageFileName && <p className="mt-2 text-center text-xs">{imageFileName}</p>}
          {imageError && <p className="mt-2 text-xs text-red-500">{imageError}</p>}
          {previewImageUrl && (
            <div className="mt-3">
              <img
                alt="선택한 이미지 미리보기"
                className="mx-auto w-72 rounded-xl object-cover"
                src={previewImageUrl}
              />
              <button
                className="mt-2 w-full text-sm text-red-500"
                onClick={handleRemoveImage}
                type="button"
              >
                이미지 삭제
              </button>
            </div>
          )}
        </div>
        <div>
          <h3 className="heading3-text mb-3">YouTube 링크 (선택)</h3>
          <input
            className="border-disabled w-full rounded-2xl border-2 px-4 py-3"
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="YouTube URL을 입력하세요"
            type="url"
            value={mediaUrl}
          />
        </div>
        <div>
          <h3 className="heading3-text mb-3">판매 수량</h3>
          <div className="mb-3 flex items-center gap-3">
            <button className="count-button" onClick={handleCountMinus} type="button">
              -
            </button>
            <input
              className="text-font-main border-disabled w-full rounded-2xl border-2 py-3 text-center text-[20px] leading-7 font-bold tracking-[-0.449px]"
              min={1}
              onChange={(e) => setCount(Math.max(1, Number(e.target.value) || 1))}
              type="number"
              value={count}
            />
            <button className="count-button" onClick={handleCountPlus} type="button">
              +
            </button>
          </div>
          <p className="text-font-gray text-center text-xs leading-4">
            {count}개의 고명이 추가됩니다.
          </p>
        </div>
        {submitError && <p>{submitError}</p>}
        <div className="border-disabled fixed bottom-0 left-0 w-full border-t bg-white px-6 py-6.25">
          <button
            className="mypage-button-base bg-grad-brand w-full text-white"
            disabled={isDisabled}
            type="submit"
          >
            {isSubmitting ? '추가 중...' : '고명 추가하기'}
          </button>
        </div>
      </form>
    </div>
  );
};
