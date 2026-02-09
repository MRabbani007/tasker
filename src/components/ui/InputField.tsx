"use client";

import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  error?: RHFError; // Compatible with RHF FieldError
}

const InputField = forwardRef<HTMLInputElement, Props>(
  ({ label, name, error, className, ...props }, ref) => {
    const errorMessage =
      error?.message || (typeof error === "string" ? error : null);

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
          <input
            id={name}
            name={name}
            ref={ref}
            className={cn(
              "w-full bg-transparent outline-none",
              "px-4 py-2.5 text-sm text-slate-800",
              "placeholder:text-slate-400 placeholder:font-normal",
              "disabled:opacity-50 disabled:cursor-not-allowed",
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

InputField.displayName = "InputField";

export default InputField;
