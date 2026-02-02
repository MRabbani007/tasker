"use client";

import { useUser } from "@/context/UserContext";
import { Search } from "lucide-react";
import React from "react";

export default function UserSearchTrigger() {
  const { setShowSearchModal } = useUser();

  return (
    <button
      onClick={() => setShowSearchModal(true)}
      className="size-10 rounded-full flex items-center justify-center bg-linear-to-br from-cyan-300 to-blue-700 hover:from-cyan-200 hover:shadow-md hover:shadow-zinc-700 duration-200 text-white"
    >
      <Search size={20} />
    </button>
  );
}
