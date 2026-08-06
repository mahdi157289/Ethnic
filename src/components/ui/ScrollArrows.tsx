interface ScrollArrowsProps {
  onScrollLeft: () => void;
  onScrollRight: () => void;
  leftId?: string;
  rightId?: string;
}

export function ScrollArrows({ onScrollLeft, onScrollRight, leftId, rightId }: ScrollArrowsProps) {
  return (
    <>
      <button
        type="button"
        id={leftId}
        onClick={onScrollLeft}
        className="forma-btn-round absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
        aria-label="Scroll left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        id={rightId}
        onClick={onScrollRight}
        className="forma-btn-round absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
        aria-label="Scroll right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  );
}
