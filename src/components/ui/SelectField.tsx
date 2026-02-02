import { cn } from "@/lib/utils";
import { forwardRef, SelectHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";
import { RiArrowDownSFill } from "react-icons/ri";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  name: string;
  options: { label: string; value: string }[];
  error?: FieldError;
  className?: string;
}

const SelectField = forwardRef<HTMLSelectElement, Props>(
  ({ label, name, options, error, className, ...props }, ref) => {
    return (
      <div className="flex-1 flex flex-col gap-0">
        {label?.trim() && (
          <label
            htmlFor={name}
            className="text-sm md:text-base font-semibold px-1 text-zinc-900"
          >
            {label}
          </label>
        )}
        <div className="flex relative">
          <select
            id={name}
            name={name}
            ref={ref}
            className={cn(
              `flex-1 border origin-bottom-right rounded-md py-1 px-2 md:py-2 md:px-4 bg-stone-100 outline-none appearance-none`,
              error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-zinc-400 focus:ring-blue-500 focus:border-blue-500",
              className,
            )}
            {...props}
          >
            <option value="">{`Select ${label ?? ""}`}</option>
            {options.map((item, idx) => (
              <option key={idx} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <div className="absolute top-1/2 -translate-y-1/2 right-2 z-10 text-zinc-900">
            <RiArrowDownSFill size={20} />
          </div>
        </div>
        {error && <p className="text-red-600 text-sm">{error.message}</p>}
      </div>
    );
  },
);

SelectField.displayName = "SelectField";

export default SelectField;
