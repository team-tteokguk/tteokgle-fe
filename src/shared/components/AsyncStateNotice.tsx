interface AsyncStateNoticeProps {
  message: string;
  type: 'error' | 'loading';
}

export const AsyncStateNotice = ({ message, type }: AsyncStateNoticeProps) => {
  const isLoading = type === 'loading';

  return (
    <div
      className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium ${
        isLoading ? 'bg-white-dark text-font-gray' : 'bg-warning-pink text-warning'
      }`}
      role={isLoading ? 'status' : 'alert'}
    >
      <span aria-hidden>{isLoading ? '⏳' : '⚠️'}</span>
      <span>{message}</span>
    </div>
  );
};
