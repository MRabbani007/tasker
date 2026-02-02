import SearchModal from "@/features/tasks/SearchModal";
import React, { ReactNode } from "react";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      {children}
      <SearchModal />
    </div>
  );
}
