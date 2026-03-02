import { useState } from 'react';

import editIcon from '../../../shared/assets/icons/pencil-blue.png';
import sendIcon from '../../../shared/assets/icons/send.png';
import deleteIcon from '../../../shared/assets/icons/trashcan-red.png';
import closeIcon from '../../../shared/assets/icons/x.png';
import { AsyncStateNotice } from '../../../shared/components/AsyncStateNotice';
import { SkeletonBlock } from '../../../shared/components/SkeletonBlock';
import { useModalStore } from '../../../store/useModalStore';
import {
  useCreateGuestBook,
  useDeleteGuestBook,
  useGuestBook,
  useUpdateGuestBook,
} from '../../guestbooks/hooks/useGuestBook';
import { useMyProfile } from '../../members/hooks/useMember';
import { useGetMyStore } from '../hooks/useStore';

interface GuestBookModalProps {
  storeId: string;
}

export const GuestBookModal = ({ storeId }: GuestBookModalProps) => {
  const { closeModal } = useModalStore();
  const { data: myStore } = useGetMyStore();
  const { data: myProfile } = useMyProfile();

  const { data: guestbookMessage, isError, isPending } = useGuestBook(storeId);
  const { isPending: isCreatePending, mutate: createGuestBook } = useCreateGuestBook(storeId);
  const { isPending: isUpdatePending, mutate: updateGuestBook } = useUpdateGuestBook(storeId);
  const { isPending: isDeletePending, mutate: deleteGuestBook } = useDeleteGuestBook(storeId);

  const [content, setContent] = useState('');
  const [editingGuestbookId, setEditingGuestbookId] = useState<null | string>(null);
  const [editingContent, setEditingContent] = useState('');

  const formatDate = (createdAt: string) => {
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return createdAt;
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const handleCreate = () => {
    const trimmed = content.trim();
    if (!trimmed || !storeId) return;
    createGuestBook(
      { content: trimmed },
      {
        onSuccess: () => setContent(''),
      },
    );
  };

  const handleStartEdit = (guestbookId: string, previousContent: string) => {
    setEditingGuestbookId(guestbookId);
    setEditingContent(previousContent);
  };

  const handleCancelEdit = () => {
    setEditingGuestbookId(null);
    setEditingContent('');
  };

  const handleSaveEdit = (guestbookId: string) => {
    const trimmed = editingContent.trim();
    if (!trimmed || !storeId) return;
    updateGuestBook(
      { body: { content: trimmed }, guestbookId },
      {
        onSuccess: () => handleCancelEdit(),
      },
    );
  };

  const handleDelete = (guestbookId: string) => {
    if (!storeId) return;
    deleteGuestBook(guestbookId);
  };

  const isSubmitting = isCreatePending || isUpdatePending || isDeletePending;

  const renderSkeletons = () =>
    Array.from({ length: 3 }).map((_, index) => (
      <li
        className="bg-grad-item border-accent-main/50 mb-3 min-h-23.5 rounded-2xl border p-4.25"
        key={`guestbook-skeleton-${index}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-8 w-8 rounded-full" />
            <SkeletonBlock className="h-4 w-20" />
          </div>
          <SkeletonBlock className="h-3 w-12" />
        </div>
        <SkeletonBlock className="mt-3 ml-10 h-4 w-4/5" />
      </li>
    ));

  return (
    <div className="bottom-sheet flex h-[80vh] max-h-156 flex-col">
      <div className="border-disabled flex w-full items-center justify-between border-b p-6">
        <div>
          <h2 className="text-font-main text-[20px] leading-7 font-bold tracking-[-0.449px]">
            방명록
          </h2>
          <span className="text-font-gray text-sm leading-5 tracking-[-0.15px]">
            {guestbookMessage?.length ?? 0}개의 메세지
          </span>
        </div>
        <button onClick={closeModal} type="button">
          <img alt="close-icon" className="w-5" src={closeIcon} />
        </button>
      </div>
      <form
        className="bg-grad-item border-b-disabled d w-full border-b p-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
      >
        <p className="heading3-text mb-3">메세지 남기기</p>
        <div className="bg-writer mb-2 flex gap-[1.12px] rounded-2xl px-4 py-3">
          <p className="text-font-gray text-sm leading-5 tracking-[-0.15px]">작성자:</p>
          <span className="heading3-text">{myProfile?.nickname ?? '-'}</span>
        </div>
        <textarea
          className="border-disabled mb-3.5 h-24 w-full resize-none rounded-2xl border-2 px-4 py-3"
          id="guestbook-comment"
          maxLength={200}
          name="guestbook-comment"
          onChange={(e) => setContent(e.target.value)}
          placeholder="따뜻한 메세지를 남겨주세요✨"
          value={content}
        ></textarea>
        <div className="flex items-center justify-between">
          <span className="text-font-gray-light text-xs leading-4">{content.length}/200</span>
          <button
            className="bg-grad-brand flex items-center gap-1.75 rounded-full px-6 py-2 text-white"
            disabled={!content.trim() || isSubmitting}
            type="submit"
          >
            <img alt="send-icon" className="h-4 w-4" src={sendIcon} />
            작성
          </button>
        </div>
      </form>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ul className="w-full p-6">
          {isPending && renderSkeletons()}
          {isError && <AsyncStateNotice message="방명록을 불러오지 못했습니다." type="error" />}
          {guestbookMessage?.map((message) => {
            const isWriter = String(myProfile?.memberId) === message.writerId;
            const isStoreOwner = myStore?.id === storeId;
            const canEdit = isWriter;
            const canDelete = isWriter || isStoreOwner;
            const isEditing = editingGuestbookId === message.id;

            return (
              <li
                className="bg-grad-item border-accent-main mb-3 min-h-23.5 rounded-2xl border p-4.25"
                key={message.id}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!message.writerImageUrl ? (
                      <div className="bg-grad-accent flex h-8 w-8 items-center justify-center rounded-full text-sm leading-5 tracking-[-0.15px]">
                        👤
                      </div>
                    ) : (
                      <img
                        alt="profile-image"
                        className="h-8 w-8 rounded-full"
                        src={message.writerImageUrl}
                      />
                    )}
                    <p className="text-font-main text-base leading-6 font-bold tracking-[-0.312px]">
                      {message.writerNickname}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-font-gray-light text-xs leading-4">
                      {formatDate(message.createdAt)}
                    </span>
                    {canEdit && !isEditing && (
                      <button
                        aria-label="edit-button"
                        className="w-3.5"
                        onClick={() =>
                          isEditing
                            ? handleSaveEdit(message.id)
                            : handleStartEdit(message.id, message.content)
                        }
                        type="button"
                      >
                        <img alt="edit-icon" src={editIcon} />
                      </button>
                    )}
                    {canDelete && !isEditing && (
                      <button
                        aria-label="delete-button"
                        className="w-3.5"
                        onClick={() => handleDelete(message.id)}
                        type="button"
                      >
                        <img alt="delete-icon" src={deleteIcon} />
                      </button>
                    )}
                  </div>
                </div>
                {isEditing ? (
                  <div className="pl-10">
                    <textarea
                      className="border-disabled focus:border-brand-main mt-2 h-15 w-full resize-none rounded-[14px] border-2 p-2"
                      maxLength={200}
                      onChange={(e) => setEditingContent(e.target.value)}
                      value={editingContent}
                    />
                    <div className="mt-3.5 flex justify-end gap-2 text-xs leading-4 font-bold">
                      <button
                        className="bg-brand-main rounded-full px-3 py-1 text-white"
                        onClick={() => handleSaveEdit(message.id)}
                        type="button"
                      >
                        저장
                      </button>
                      <button
                        className="text-font-gray-dark bg-disabled rounded-full px-3 py-1"
                        onClick={handleCancelEdit}
                        type="button"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-font-black pl-10 text-sm leading-5 tracking-[-0.15px]">
                    {message.content}
                  </p>
                )}
              </li>
            );
          })}
          {!isPending && !isError && (guestbookMessage?.length ?? 0) === 0 && (
            <li className="text-font-gray flex h-45 flex-col items-center justify-center gap-3 text-center text-sm">
              <p className="text-5xl leading-12 tracking-[0.352px]">📝</p>
              <p className="text-font-gray text-base leading-6 tracking-[0.312px]">
                첫 방명록을 남겨주세요!
              </p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
