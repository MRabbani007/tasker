import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  error?: RHFError;
}

const InputField = forwardRef<HTMLInputElement, Props>(
  ({ label, name, error, className, ...props }, ref) => {
    const errorMessage =
      typeof error === "string"
        ? error
        : typeof error?.message === "string"
          ? error.message
          : null;

    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label && (
          <label
            htmlFor={name}
            className={cn(
              "px-1 text-sm font-medium transition-colors",
              error ? "text-red-600" : "text-zinc-700",
            )}
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "relative rounded-xl border transition-all duration-200",
            "bg-zinc-50 hover:bg-white",
            "focus-within:ring-2 focus-within:ring-blue-500/40",
            error
              ? "border-red-500 focus-within:ring-red-500/40"
              : "border-zinc-300",
          )}
        >
          <input
            id={name}
            name={name}
            ref={ref}
            className={cn(
              "w-full bg-transparent outline-none",
              "px-3 py-2 text-sm text-zinc-900",
              "placeholder:text-zinc-400",
              "disabled:opacity-60 disabled:cursor-not-allowed",
            )}
            {...props}
          />
        </div>

        {errorMessage && (
          <p className="text-xs text-red-600 px-1">{errorMessage}</p>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";

export default InputField;
