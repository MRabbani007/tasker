import { ReactNode } from "react";

export default function PageHeader({
  pageTitle,
  icon,
  children,
  secondChildren,
  className,
}: {
  pageTitle?: string;
  icon?: ReactNode;
  children?: ReactNode;
  secondChildren?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={"p-0 flex flex-col items-start gap-4 rounded-xl" + className}
    >
      <header className="self-stretch flex items-center flex-wrap group">
        {icon && (
          <div className="p-2 bg-orange-900/80 text-white duration-200 rounded-lg hidden lg:flex">
            {icon}
          </div>
        )}
        {pageTitle && <h1 className="flex-1 font-normal">{pageTitle}</h1>}
        {children}
      </header>
      {secondChildren && (
        <div className="flex items-center justify-end self-stretch">
          {secondChildren}
        </div>
      )}
    </div>
  );
}
