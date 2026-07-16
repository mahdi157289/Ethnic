import { useState, useRef, useCallback } from 'react';

interface ImageSliderProps {
  images: string[];
  alt: string;
  activeIndex: number;
  setActiveIndex?: (index: number) => void;
  className?: string;
  dotsAlwaysVisible?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function ImageSlider({
  images,
  alt,
  activeIndex,
  setActiveIndex,
  className = '',
  dotsAlwaysVisible = false,
  onMouseEnter,
  onMouseLeave,
}: ImageSliderProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const slideRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !slideRef.current) return;
    const rect = slideRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setPosition({ x, y });
  }, [isZoomed]);

  return (
    <div
      className={`image-slider ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {images.map((img, idx) => (
        <div
          key={idx}
          ref={idx === activeIndex ? slideRef : null}
          className={`slide ${idx === activeIndex ? 'active' : ''} ${isZoomed ? 'zoomed' : ''}`}
          onClick={() => setIsZoomed(!isZoomed)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={img}
            alt={alt}
            style={{
              transformOrigin: `${position.x * 100}% ${position.y * 100}%`
            }}
          />
        </div>
      ))}
      {images.length > 1 && (
        <div className="slider-dots" style={dotsAlwaysVisible ? { opacity: 1 } : undefined}>
          {images.map((_, idx) => (
            <div key={idx} className={`slider-dot ${idx === activeIndex ? 'active' : ''}`} />
          ))}
        </div>
      )}
      {images.length > 1 && setActiveIndex && (
        <div className="slider-thumbnails">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={`slider-thumbnail ${idx === activeIndex ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(idx);
              }}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
