export const BouncingEmojis = () => {
  return (
    <div className="flex justify-center gap-0.75 text-4xl leading-10 tracking-[0.369px]">
      <p className="animate-bounce">🥚</p>
      <p className="animate-bounce [animation-delay:0.2s]">🥩</p>
      <p className="animate-bounce [animation-delay:0.4s]">🌿</p>
    </div>
  );
};
