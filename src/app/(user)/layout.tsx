import Sidebar from "@/features/navigation/Sidebar";
import SearchModal from "@/features/tasks/SearchModal";
import { getSession } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

export default async function UserLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session.authenticated) {
    redirect("/login");
  }

  return (
    <div className="flex-1 flex items-stretch">
      <Sidebar user={{ firstName: session?.user?.firstName ?? "" }} />
      {children}
      <SearchModal />
    </div>
  );
}
