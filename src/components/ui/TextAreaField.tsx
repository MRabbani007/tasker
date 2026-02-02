import { forwardRef, TextareaHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name: string;
  error?: FieldError;
  lang?: "English" | "Russian";
}

const TextAreaField = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, name, error, lang, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-0">
        {label && (
          <label
            htmlFor={name}
            className="text-base font-semibold px-1 text-zinc-900"
          >
            {label}
          </label>
        )}
        <textarea
          id={name}
          name={name}
          ref={ref}
          lang={lang}
          className={`border rounded-md p-2 min-h-20 outline-none bg-stone-100 ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-zinc-400 focus:ring-blue-500 focus:border-blue-500"
          }`}
          {...props}
        />
        {error && <p className="text-red-600 text-sm">{error.message}</p>}
      </div>
    );
  },
);

TextAreaField.displayName = "TextAreaField";

export default TextAreaField;
