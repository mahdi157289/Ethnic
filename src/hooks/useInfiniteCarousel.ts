import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

interface UseInfiniteCarouselOptions {
  itemCount: number;
  speed?: number;
  scrollStep?: number;
}

export function useInfiniteCarousel({ itemCount, speed = 80, scrollStep = 320 }: UseInfiniteCarouselOptions) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Drag state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const normalizeX = useCallback((x: number, totalWidth: number) => {
    if (x < -totalWidth) return x + totalWidth;
    if (x > 0) return x - totalWidth;
    return x;
  }, []);

  const scheduleResume = useCallback(() => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => setIsPaused(false), 2000);
  }, []);

  const createTween = useCallback(() => {
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }
    if (!trackRef.current || itemCount === 0) return;

    const track = trackRef.current;
    const totalWidth = track.scrollWidth / 2;
    const duration = totalWidth / speed;

    gsap.set(track, { x: 0 });

    tweenRef.current = gsap.to(track, {
      x: -totalWidth,
      duration,
      ease: 'none',
      repeat: -1,
      paused: isPaused,
      onRepeat: () => {
        gsap.set(track, { x: 0 });
      },
    });
  }, [itemCount, speed, isPaused]);

  // Create/recreate tween on item count or pause change
  useEffect(() => {
    createTween();
    const timeoutId = setTimeout(createTween, 500);

    const handleResize = () => createTween();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      if (tweenRef.current) tweenRef.current.kill();
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [createTween]);

  // Pause/play without recreating
  useEffect(() => {
    if (!tweenRef.current) return;
    isPaused ? tweenRef.current.pause() : tweenRef.current.play();
  }, [isPaused]);

  const scrollLeft = useCallback(() => {
    if (!tweenRef.current || !trackRef.current) return;
    setIsPaused(true);
    tweenRef.current.pause();
    const track = trackRef.current;
    const currentX = gsap.getProperty(track, 'x') as number;
    const newX = Math.max(0, currentX - scrollStep);
    gsap.to(track, {
      x: newX,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        if (!isPaused) tweenRef.current?.play();
      },
    });
  }, [scrollStep, isPaused]);

  const scrollRight = useCallback(() => {
    if (!tweenRef.current || !trackRef.current) return;
    setIsPaused(true);
    tweenRef.current.pause();
    const track = trackRef.current;
    const currentX = gsap.getProperty(track, 'x') as number;
    const totalWidth = track.scrollWidth / 2;
    const newX = currentX - scrollStep <= -totalWidth ? 0 : currentX - scrollStep;
    gsap.to(track, {
      x: newX,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        if (!isPaused) tweenRef.current?.play();
      },
    });
  }, [scrollStep, isPaused]);

  const resumeScroll = useCallback(() => {
    setIsPaused(false);
    tweenRef.current?.play();
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current) return;
    setIsPaused(true);
    tweenRef.current?.pause();
    isDraggingRef.current = true;
    startXRef.current = e.pageX;
    startScrollLeftRef.current = gsap.getProperty(trackRef.current, 'x') as number;
    lastXRef.current = e.pageX;
    lastTimeRef.current = Date.now();
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    const currentX = startScrollLeftRef.current + (e.pageX - startXRef.current);
    const totalWidth = trackRef.current.scrollWidth / 2;
    gsap.set(trackRef.current, { x: normalizeX(currentX, totalWidth) });

    const now = Date.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) velocityRef.current = (e.pageX - lastXRef.current) / dt;
    lastXRef.current = e.pageX;
    lastTimeRef.current = now;
  }, [normalizeX]);

  const applyMomentum = useCallback(() => {
    if (trackRef.current) {
      const currentX = gsap.getProperty(trackRef.current, 'x') as number;
      const totalWidth = trackRef.current.scrollWidth / 2;
      const momentum = velocityRef.current * 100;
      const newX = normalizeX(currentX + momentum, totalWidth);
      gsap.to(trackRef.current, {
        x: newX,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: scheduleResume,
      });
    } else {
      scheduleResume();
    }
  }, [normalizeX, scheduleResume]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    applyMomentum();
  }, [applyMomentum]);

  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) handleMouseUp();
  }, [handleMouseUp]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!trackRef.current) return;
    setIsPaused(true);
    tweenRef.current?.pause();
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].pageX;
    startScrollLeftRef.current = gsap.getProperty(trackRef.current, 'x') as number;
    lastXRef.current = e.touches[0].pageX;
    lastTimeRef.current = Date.now();
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    const currentX = startScrollLeftRef.current + (e.touches[0].pageX - startXRef.current);
    const totalWidth = trackRef.current.scrollWidth / 2;
    gsap.set(trackRef.current, { x: normalizeX(currentX, totalWidth) });

    const now = Date.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) velocityRef.current = (e.touches[0].pageX - lastXRef.current) / dt;
    lastXRef.current = e.touches[0].pageX;
    lastTimeRef.current = now;
  }, [normalizeX]);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
    applyMomentum();
  }, [applyMomentum]);

  return {
    trackRef,
    containerRef,
    titleRef,
    isPaused,
    setIsPaused,
    tweenRef,
    isDraggingRef,
    scrollLeft,
    scrollRight,
    resumeScroll,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
