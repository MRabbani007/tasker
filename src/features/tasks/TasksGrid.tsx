"use client";

import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export default function TasksGrid({ children }: { children: ReactNode }) {
  const { openUserLists } = useUser();
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  gap-6",
        openUserLists ? "lg:grid-cols-2" : "lg:grid-cols-3",
      )}
    >
      {children}
    </div>
  );
}
