import { useEffect } from 'react';

import closeIcon from '../../../shared/assets/icons/x.png';
import { AsyncStateNotice } from '../../../shared/components/AsyncStateNotice';
import { getItemEmoji, getItemNameKR } from '../../../shared/utils/itemUtils';
import { decodeNewlines } from '../../../shared/utils/textUtils';
import { useModalStore } from '../../../store/useModalStore';
import { useItemDetail, useReadItem } from '../hooks/useMyItem';

const toYouTubeEmbedUrl = (url: string): null | string => {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtu.be')) {
      const videoId = parsed.pathname.replace('/', '');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
  } catch (_error) {
    return null;
  }

  return null;
};

export const ItemDetailModal = ({ itemId }: { itemId: string }) => {
  const { closeModal } = useModalStore();
  const { data, error, isPending } = useItemDetail(itemId);
  const { mutate: readItem } = useReadItem(itemId);
  const isAlreadyRead = data ? data.isRead || (data as ItemDetailWithRead).read === true : false;

  interface ItemDetailWithRead {
    read?: boolean;
  }

  useEffect(() => {
    if (!data || isAlreadyRead) return;
    readItem();
  }, [data, isAlreadyRead, readItem]);

  const embeddedYouTubeUrl = data?.mediaUrl ? toYouTubeEmbedUrl(data.mediaUrl) : null;
  const itemTypeLabel = data?.itemType || data?.name || '';

  return (
    <article className="w-[min(28rem,94vw)] rounded-4xl bg-white shadow-2xl">
      <div className="border-disabled flex items-center justify-between border-b px-6 py-6.5">
        <h3 className="text-font-main text-xl leading-7 font-bold tracking-[-0.449px]">
          고명 정보
        </h3>
        <button aria-label="close-button" className="p-1.5" onClick={closeModal} type="button">
          <img alt="close-icon" className="w-5" src={closeIcon} />
        </button>
      </div>
      <div className="py-1.25 pr-3 pl-6">
        <div className="pretty-scrollbar max-h-[calc(70vh-10px)] space-y-4 overflow-y-auto py-5 pr-2">
          {error && <AsyncStateNotice message="고명 정보를 불러오지 못했습니다." type="error" />}
          {isPending && <AsyncStateNotice message="고명 정보를 불러오는 중..." type="loading" />}
          {!isPending && !error && data && (
            <>
              <p className="text-center text-7xl leading-18 tracking-[0.123px]">
                {getItemEmoji(itemTypeLabel)}
              </p>
              <p className="text-font-main text-center text-2xl leading-8 font-bold tracking-[0.07px]">
                {getItemNameKR(itemTypeLabel)}
              </p>
              <div className="bg-grad-bg rounded-2xl p-4">
                <p className="text-font-main mb-2 text-sm font-bold">💬 메시지</p>
                <p className="text-font-gray rounded-2xl text-sm whitespace-pre-line">
                  {data.content ? decodeNewlines(data.content) : '메시지가 없습니다.'}
                </p>
              </div>

              {data.imageUrl && (
                <div>
                  <p className="text-font-main mb-1 text-sm font-bold">🖼️ 이미지</p>
                  <img alt="item-image" className="w-full rounded-2xl" src={data.imageUrl} />
                </div>
              )}

              {!!embeddedYouTubeUrl && (
                <div>
                  <p className="text-font-main mb-1 text-sm font-bold">🎥 YouTube</p>
                  <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="aspect-video w-full rounded-2xl"
                    src={embeddedYouTubeUrl}
                    title="YouTube video player"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
};
