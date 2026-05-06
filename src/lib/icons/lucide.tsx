"use client";

import * as LucideIcons from "lucide-react";
import { LucideIcon, HelpCircle } from "lucide-react";

type IconRendererProps = {
  iconString?: string | null;
  size?: number;
  className?: string;
};

// 1. Create a typed record of the library to satisfy the index signature
const iconLibrary = LucideIcons as unknown as Record<string, LucideIcon>;

export function IconRenderer({
  iconString,
  size = 20,
  className,
}: IconRendererProps) {
  // 2. Extract name safely: handles "lucide:Wallet" or "Wallet"
  const rawName = iconString?.includes(":")
    ? iconString.split(":")[1]
    : iconString;

  // 3. Resolve the component
  // If rawName is missing or not in the library, we default to HelpCircle
  const IconComponent: LucideIcon =
    rawName && iconLibrary[rawName] ? iconLibrary[rawName] : HelpCircle;

  // 4. Render as a standard React component
  return <IconComponent size={size} className={className} />;
}
