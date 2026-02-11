"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: React.ReactNode[];
  autoplay?: boolean;
  autoplaySpeed?: number;
  className?: string;
}

export default function Carousel({
  children,
  autoplay = false,
  autoplaySpeed = 3000,
  className,
}: CarouselProps) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const slideCount = children.length;

  const next = () => {
    setIndex((prev) => (prev + 1) % slideCount);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + slideCount) % slideCount);
  };

  useEffect(() => {
    if (!autoplay) return;

    timeoutRef.current = setTimeout(next, autoplaySpeed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, autoplay, autoplaySpeed]);

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden rounded-xl",
        className,
      )}
      onMouseEnter={() =>
        timeoutRef.current && clearTimeout(timeoutRef.current)
      }
      onMouseLeave={() =>
        autoplay && (timeoutRef.current = setTimeout(next, autoplaySpeed))
      }
    >
      {/* Slides */}
      <div
        className="flex h-full shrink-0 transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {children.map((child, i) => (
          <div key={i} className="w-full h-full shrink-0 bg-red-200">
            {child}
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {children.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              i === index ? "bg-white w-4" : "bg-white/50",
            )}
          />
        ))}
      </div>

      {/* Arrows (desktop only) */}
      <button
        onClick={prev}
        className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8 items-center justify-center"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8 items-center justify-center"
      >
        ›
      </button>
    </div>
  );
}
