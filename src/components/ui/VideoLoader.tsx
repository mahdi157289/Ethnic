import { useEffect, useRef, useState } from 'react';
import { loaderVideo } from '../../assets/brand';

interface VideoLoaderProps {
  onComplete: () => void;
  backgroundColor?: string;
}

const MAX_WAIT_MS = 15000;

export function VideoLoader({ onComplete, backgroundColor }: VideoLoaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const completedRef = useRef(false);
  
  // Construct the background class
  const bgClass = backgroundColor || 'bg-[#0F0F0F]';
  const containerClass = `fixed inset-0 z-[100] flex items-center justify-center ${bgClass} transition-opacity duration-600 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`;

  const finish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setFadeOut(true);
    setTimeout(onComplete, 600);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const maxTimer = setTimeout(finish, MAX_WAIT_MS);

    video.play().catch(() => {
      setTimeout(finish, 1500);
    });

    return () => clearTimeout(maxTimer);
  }, []);

  return (
      <div
        className={containerClass}
        aria-label="Loading Ethnic"
        role="status"
      >
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          src={loaderVideo}
          className="h-full w-full object-contain object-center"
          autoPlay
        muted
        playsInline
        onEnded={() => setTimeout(finish, 300)}
        onError={() => setTimeout(finish, 1500)}
        />
      </div>
    </div>
  );
}
