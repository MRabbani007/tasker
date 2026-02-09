"use client";

import {
  forwardRef,
  TextareaHTMLAttributes,
  useRef,
  useImperativeHandle,
} from "react";
import { cn } from "@/lib/utils";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name: string;
  error?: RHFError; // Compatible with React Hook Form FieldError
}

const TextAreaField = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, name, error, className, onChange, ...props }, ref) => {
    const errorMessage =
      error?.message || (typeof error === "string" ? error : null);

    // Internal ref for auto-grow logic
    const internalRef = useRef<HTMLTextAreaElement>(null);

    // Merge external ref with internal ref
    useImperativeHandle(ref, () => internalRef.current!);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (internalRef.current) {
        // Auto-grow logic
        internalRef.current.style.height = "auto";
        internalRef.current.style.height = `${internalRef.current.scrollHeight}px`;
      }
      if (onChange) onChange(e);
    };

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", className)}>
        {label && (
          <label
            htmlFor={name}
            className={cn(
              "ml-1 text-[11px] font-bold uppercase tracking-wider transition-colors",
              errorMessage ? "text-rose-500" : "text-slate-500",
            )}
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "relative rounded-xl border transition-all duration-300 ease-out",
            "bg-slate-50/50 hover:border-slate-400",
            "focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500",
            errorMessage
              ? "border-rose-300 bg-rose-50/30 focus-within:ring-rose-500/10 focus-within:border-rose-500"
              : "border-slate-200 shadow-sm",
          )}
        >
          <textarea
            id={name}
            name={name}
            ref={internalRef}
            rows={3}
            onChange={handleInput}
            className={cn(
              "w-full bg-transparent outline-none",
              "px-4 py-3 text-sm text-slate-800 leading-relaxed",
              "placeholder:text-slate-400 placeholder:font-normal",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "min-h-20 resize-none overflow-hidden", // Hidden scrollbar for auto-grow feel
            )}
            {...props}
          />
        </div>

        {errorMessage && (
          <p className="text-[11px] font-medium text-rose-500 ml-1 animate-in fade-in slide-in-from-top-1">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

TextAreaField.displayName = "TextAreaField";

export default TextAreaField;
