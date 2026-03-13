interface SkeletonBlockProps {
  className?: string;
}

export const SkeletonBlock = ({ className = '' }: SkeletonBlockProps) => {
  return <div className={`bg-disabled/60 animate-pulse rounded-xl ${className}`} />;
};
