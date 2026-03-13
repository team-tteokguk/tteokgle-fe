interface LoadingSpinnerProps {
  className?: string;
  label?: string;
  size?: 'lg' | 'md' | 'sm';
}

const SPINNER_SIZE_CLASS: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  lg: 'h-10 w-10 border-4',
  md: 'h-8 w-8 border-[3px]',
  sm: 'h-6 w-6 border-2',
};

export const LoadingSpinner = ({
  className = '',
  label = '불러오는 중...',
  size = 'md',
}: LoadingSpinnerProps) => {
  return (
    <div
      aria-live="polite"
      className={`flex items-center justify-center ${className}`}
      role="status"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={`border-disabled border-t-brand-main animate-spin rounded-full ${SPINNER_SIZE_CLASS[size]}`}
        />
        <span className="text-font-gray text-sm">{label}</span>
      </div>
    </div>
  );
};
