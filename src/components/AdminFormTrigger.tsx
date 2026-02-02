"use client";

import { useAdmin } from "@/context/AdminContext";
import { cn } from "@/lib/utils";
import { LucideIcon, Pencil, PlusIcon, Trash } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  label?: string;
  value: AdminFormType;
  icon?: ReactNode;
  iconName?: "add" | "edit" | "delete";
  children?: ReactNode;
  type?: "button" | "icon" | "container";
  trigger?: "add" | "edit";
  editItem?: AdminEditItem;
  className?: string;
}

const ICON_MAP: Record<NonNullable<Props["iconName"]>, LucideIcon> = {
  edit: Pencil,
  delete: Trash,
  add: PlusIcon,
};

export default function AdminFormTrigger({
  label,
  value,
  icon,
  iconName,
  children,
  type = "container",
  editItem,
  trigger = "edit",
  className,
}: Props) {
  const { setShowForm, setEditItem } = useAdmin();

  const handleClick = () => {
    if (trigger === "edit") {
      setShowForm(value);
      setEditItem(editItem ?? null);
    } else {
      setShowForm(value);
    }
  };

  const Icon = iconName ? ICON_MAP[iconName] : null;

  if (type === "button") {
    return (
      <button
        onClick={handleClick}
        type="button"
        className={cn(
          "inline-flex items-center gap-2 border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 transition",
          className,
        )}
      >
        {label?.trim() && <span>{label}</span>}
      </button>
    );
  } else if (type === "icon") {
    return (
      <button
        onClick={handleClick}
        type="button"
        className={cn(
          "inline-flex items-center gap-2 p-1 hover:bg-zinc-200 duration-200 rounded-sm cursor-pointer",
          iconName === "delete" ? "text-red-700 hover:bg-red-200" : "",
          iconName === "edit" ? "text-zinc-700 hover:bg-zinc-200" : "",
          className,
        )}
      >
        {Icon ? <Icon size={18} /> : icon}
      </button>
    );
  } else if (type === "container") {
    return (
      <div onClick={handleClick} className={cn("cursor-pointer", className)}>
        {children}
      </div>
    );
  } else {
    return null;
  }
}
