type TteokData = {
  h: string;
  left: string;
  rotate: string;
  top: string;
  w: string;
};

export const TteokPiece = ({ style }: { style: TteokData }) => {
  const dynamicStyle = {
    height: style.h,
    left: style.left,
    top: style.top,
    transform: `rotate(${style.rotate})`,
    width: style.w,
  };

  return (
    <div
      className="bg-grad-tteok absolute flex flex-col items-center justify-center rounded-full border-2 border-white/50 shadow-md"
      style={dynamicStyle}
    >
      <div className="mx-auto h-[50%] w-[85%] shrink-0 rounded-full bg-white/30" />
    </div>
  );
};
