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
      <div className={cn("flex-1 flex flex-col gap-0", className)}>
        {label && (
          <label
            htmlFor={name}
            className="text-base font-semibold px-1 text-zinc-900"
          >
            {label}
          </label>
        )}
        <input
          id={name}
          name={name}
          ref={ref}
          className={`border border-zinc-400 rounded-md py-1 px-2 md:py-2 md:px-4 bg-stone-100 outline-none ${
            error
              ? "border-red-500 focus:border-red-700"
              : "border-gray-300 focus:border-brand-dark"
          }`}
          {...props}
        />
        {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
      </div>
    );
  },
);

// Important for development tools and debugging
InputField.displayName = "InputField";

export default InputField;
