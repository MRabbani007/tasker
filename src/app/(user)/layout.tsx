import Sidebar from "@/features/navigation/Sidebar";
import SearchModal from "@/features/tasks/SearchModal";
import React, { ReactNode } from "react";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 flex items-stretch">
      <Sidebar />
      {children}
      <SearchModal />
    </div>
  );
}
