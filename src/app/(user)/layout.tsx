import Sidebar from "@/features/navigation/Sidebar";
import SearchModal from "@/features/tasks/SearchModal";
import { getCurrentUser } from "@/lib/auth/utils";
import React, { ReactNode } from "react";

export default async function UserLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex-1 flex items-stretch">
      <Sidebar user={{ firstName: user?.firstName ?? "" }} />
      {children}
      <SearchModal />
    </div>
  );
}
