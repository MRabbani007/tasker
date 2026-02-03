"use client";

import { userPages } from "@/lib/shared";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { MdOutlineTaskAlt } from "react-icons/md";

export default function Footer() {
  const pathname = usePathname().split("/")[1];

  const onUserPage = userPages.includes(pathname);

  if (onUserPage) {
    return null;
  }

  return (
    <div className="flex flex-wrap flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 px-6 bg-linear-to-l from-cyan-950 to-gray-950 text-white">
      <Link href="/" title="Home Page" className="flex items-center gap-1">
        {/* <img src={Logo} alt="Logo" className="w-12" /> */}
        <MdOutlineTaskAlt size={25} />
        <span className="font-bold text-xl">Taskit</span>
      </Link>
      <p className="font-mono flex flex-wrap items-center whitespace-nowrap">
        <span className="text-xl">&#169;</span>
        <span>2026 Taskit Inc. </span>
        <span>All rights reserved.</span>
      </p>
    </div>
  );
}
