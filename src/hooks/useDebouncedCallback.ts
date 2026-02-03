// lib/useDebouncedCallback.ts
import { useRef } from "react";

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay = 500,
) {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  return (...args: Parameters<T>) => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => callback(...args), delay);
  };
}
