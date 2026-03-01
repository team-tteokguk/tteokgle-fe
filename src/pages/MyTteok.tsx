import { AddItemModal } from '../features/myItems/components/AddItemModal';
import { PlacedItem } from '../features/myItems/components/PlacedItem';
import { TteokPiece } from '../features/myItems/components/TteokPiece';
import { usePlacedItemList } from '../features/myItems/hooks/useMyItem';
import plusIcon from '../shared/assets/icons/plus.png';
import { TitleCard } from '../shared/components/TitleCard';
import { useModalStore } from '../store/useModalStore';

export const MyTteok = () => {
  const { data, error, isPending } = usePlacedItemList();
  const { openModal } = useModalStore();

  console.log(data);

  const TTEOK_DATA = [
    { h: '56px', left: '25%', rotate: '-15deg', top: '20%', w: '68px' },
    { h: '50px', left: '45%', rotate: '20deg', top: '35%', w: '62px' },
    { h: '58px', left: '20%', rotate: '-40deg', top: '55%', w: '70px' },
    { h: '53px', left: '45%', rotate: '10deg', top: '65%', w: '65px' },
    { h: '48px', left: '15%', rotate: '160deg', top: '40%', w: '60px' },
    { h: '60px', left: '60%', rotate: '45deg', top: '25%', w: '72px' },
    { h: '54px', left: '65%', rotate: '-10deg', top: '50%', w: '66px' },
  ];

  const handleAddClick = () => {
    openModal(<AddItemModal />);
  };

  return (
    <div>
      <TitleCard sub="고명을 터치해 메시지를 확인하세요" title="나의 떡국" />
      <div className="mt-4 flex flex-col items-center gap-6 rounded-4xl border border-white/50 bg-white/90 p-8.25">
        <div className="bg-grad-plate flex h-95.5 w-95.5 items-center justify-center rounded-full shadow-2xl">
          <div className="bg-grad-outline mx-auto flex h-80.25 w-80.25 items-center justify-center rounded-full">
            <div className="bg-grad-bowl flex h-77 w-77 items-center justify-center rounded-full">
              <div className="bg-grad-soup relative h-69.5 w-69.5 rounded-full">
                {TTEOK_DATA.map((style, idx) => (
                  <TteokPiece key={idx} style={style} />
                ))}
                {/* TODO: 에러 & 오류 UI 디자인 후 적용하기 */}
                {isPending && <div>Loading...</div>}
                {error && <div>Error!</div>}
                {data &&
                  !isPending &&
                  data.items.map((item) => <PlacedItem item={item} key={item.id} />)}
              </div>
            </div>
          </div>
        </div>
        <button
          className="bg-grad-title-card flex w-full items-center justify-center gap-1.75 rounded-2xl py-4 text-base leading-6 font-bold tracking-[-0.312px] text-white shadow-lg"
          onClick={handleAddClick}
          type="button"
        >
          <img alt="plus-icon" className="w-5" src={plusIcon} />
          고명추가
        </button>
      </div>
    </div>
  );
};
