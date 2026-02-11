import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "group relative text-sm font-semibold transition-colors py-1",
        isActive ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600",
      )}
    >
      <span>{children}</span>
      {/* Persistent underline for active, sliding for hover */}
      <span
        className={cn(
          "absolute -bottom-1 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ease-out",
          isActive ? "w-full" : "w-0 group-hover:w-full",
        )}
      />
    </Link>
  );
}
