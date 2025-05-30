"use client";

import { useEffect, useState } from "react";

interface ReadingProgressProps {
  targetId: string;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({ targetId }) => {
  const [progress, setProgress] = useState(-1);

  useEffect(() => {
    const handleScroll = () => {
      const target = document.getElementById(targetId);
      if (!target) return;

      const { top, height } = target.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;

      const scrolled = Math.min(
        ((scrollTop - (top + scrollTop) + viewportHeight) / height) * 100,
        100,
      );

      setProgress(Math.max(-1, scrolled));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetId]);

  return (
    <div
      className="bg-foreground fixed top-0 left-0 z-50 h-1 w-full -translate-x-full transition-all ease-out"
      style={{ transform: `translate3d(${progress}%, 0, 0)` }}
    >
      <div className="absolute right-0 h-full w-24 -translate-y-1 rotate-3 transform bg-transparent shadow-[0_0_10px_rgba(var(--foreground)),_0_0_5px_rgba(var(--foreground))]" />
    </div>
  );
};

export default ReadingProgress;
