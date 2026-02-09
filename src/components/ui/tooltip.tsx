"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TooltipContextType = {
  open: boolean;
  show: () => void;
  hide: () => void;
  disabled: boolean;
};

const TooltipContext = createContext<TooltipContextType | null>(null);

export function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const temp = () => {
      // Disable tooltip on touch devices
      const isTouch =
        typeof window !== "undefined" &&
        window.matchMedia("(hover: none)").matches;

      setDisabled(isTouch);
    };

    temp();
  }, []);

  const show = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, 150);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  return (
    <TooltipContext.Provider value={{ open, show, hide, disabled }}>
      <div className="relative inline-flex">{children}</div>
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({ children }: { children: React.ReactNode }) {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error("TooltipTrigger must be inside Tooltip");

  if (ctx.disabled) {
    return <>{children}</>;
  }

  return (
    <div
      tabIndex={0}
      onMouseEnter={ctx.show}
      onMouseLeave={ctx.hide}
      onFocus={ctx.show}
      onBlur={ctx.hide}
      className="cursor-default outline-none"
    >
      {children}
    </div>
  );
}

export function TooltipContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error("TooltipContent must be inside Tooltip");

  if (!ctx.open || ctx.disabled) return null;

  return (
    <>
      <div
        role="tooltip"
        className={cn(
          "absolute z-50 left-1/2 top-0 -translate-x-1/2 -translate-y-full text-nowrap bg-white",
          "rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground",
          "shadow-md",
          "animate-in fade-in-0 zoom-in-95",
          className,
        )}
      >
        {children}
        {/* Arrow */}
        <div
          className={cn(
            "absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 rotate-45",
            "bg-popover border-r border-b",
          )}
        />
      </div>
    </>
  );
}
