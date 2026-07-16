import { useCallback, useEffect, useRef, useState } from 'react';

export function useImageSlider(imageCount: number, intervalMs = 2000, autoPlay = false) {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (imageCount <= 1) return;
    clear();
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % imageCount);
    }, intervalMs);
  }, [imageCount, intervalMs, clear]);

  const stop = useCallback(() => {
    clear();
    setActiveIndex(0);
  }, [clear]);

  useEffect(() => {
    if (autoPlay) start();
    return clear;
  }, [autoPlay, start, clear]);

  useEffect(() => () => clear(), [clear]);

  return { activeIndex, start, stop, setActiveIndex };
}
