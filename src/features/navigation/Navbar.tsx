"use client";

import Link from "next/link";
import { MdOutlineTaskAlt } from "react-icons/md";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";
import { userPages } from "@/lib/shared";
import { useState } from "react";
import { Menu } from "lucide-react";
import NavLink from "./NavLink";

export default function Navbar({ user }: { user?: User }) {
  const pathname = usePathname().split("/")[1];
  const [isOpen, setIsOpen] = useState(false);

  const onUserPage = userPages.includes(pathname);

  // if (onUserPage) {
  //   return null;
  // }

  return (
    <>
      {/* Navbar */}
      {!onUserPage && (
        <nav className="sticky top-0 z-50 bg-white/80 border-b border-slate-200 backdrop-blur-md">
          <div className="px-4 py-4 flex items-center justify-between gap-4">
            {/* Left – Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-indigo-200 shadow-lg group-hover:scale-105 transition-transform">
                <MdOutlineTaskAlt size={22} />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">
                Tasker
              </span>
            </Link>

            {/* Center – Marketing links */}
            {(!user || true) && (
              <div className="hidden md:flex items-center gap-8">
                <NavLink href="/about">About</NavLink>
                <NavLink href="/features">Features</NavLink>
                <NavLink href="/pricing">Pricing</NavLink>
              </div>
            )}

            {/* Right */}
            <div className="flex items-center gap-4">
              {user?.email ? (
                <UserMenu user={user} />
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-indigo-200 shadow-lg hover:bg-indigo-700 transition-all hover:shadow-indigo-300"
                >
                  Get Started
                </Link>
              )}
              {/* Mobile MenuTrigger Button */}
              {/* <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors lg:hidden"
              >
                <Menu size={26} />
              </button> */}
            </div>
          </div>
        </nav>
      )}
      {/* Mobile Menu Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-2 rounded-xl
             text-slate-600 bg-slate-100 transition-colors
             lg:hidde"
      >
        <Menu size={26} />
      </button>
      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
