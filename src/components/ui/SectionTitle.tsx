interface SectionTitleProps {
  title: string;
  subtitle?: string;
  size?: 'lg' | 'sm';
  className?: string;
}

export function SectionTitle({ title, subtitle, size = 'lg', className = '' }: SectionTitleProps) {
  const sizeClasses = size === 'lg'
    ? 'text-center mb-10'
    : 'mb-4 md:mb-6';
  const headingClasses = size === 'lg'
    ? 'section-title font-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#0F0F0F]'
    : 'section-title font-display text-lg md:text-xl text-[#0F0F0F]';
  const dotClasses = size === 'lg'
    ? 'section-dot hidden sm:block'
    : 'section-dot';

  return (
    <div className={sizeClasses}>
      {subtitle && (
        <p className="text-xs sm:text-sm tracking-[0.3em] text-[#0F0F0F]/60 uppercase mb-3">
          {subtitle}
        </p>
      )}
      <h2 className={`${headingClasses} ${className}`}>
        <span className={dotClasses} />
        <span className="section-title-text">{title}</span>
        <span className={dotClasses} />
      </h2>
    </div>
  );
}