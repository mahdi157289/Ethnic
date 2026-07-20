import { ethnicLogo } from '../../assets/brand';

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  src?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

export function BrandLogo({
  className = '',
  imageClassName = 'h-10 w-auto object-contain',
  src = ethnicLogo,
  showWordmark = false,
  wordmarkClassName = 'font-display text-2xl font-semibold text-[#0F0F0F] tracking-wider',
}: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img src={src} alt="Ethnic" className={imageClassName} />
      {showWordmark && <span className={wordmarkClassName}>Ethnic</span>}
    </div>
  );
}
