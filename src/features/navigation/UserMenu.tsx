"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { useSession } from "@/context/SessionProvider";

export default function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const { logout } = useSession();

  const menuRef = useRef<HTMLDivElement | null>(null);

  // Update initials logic for safety
  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      {/* Avatar */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-indigo-200 shadow-lg hover:scale-105 transition-transform"
      >
        {initials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden z-60"
          >
            {/* Header */}
            <div className="bg-slate-50/50 px-4 py-4 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-800">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[11px] font-medium text-indigo-500 uppercase tracking-wider">
                Pro Plan
              </p>
            </div>

            {/* Menu Links */}
            <div className="p-2 flex flex-col gap-1">
              <MenuLink href="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </MenuLink>
              <MenuLink
                href="/settings"
                icon={<Settings size={16} />}
                onClick={() => setOpen(false)}
              >
                Settings
              </MenuLink>

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={() => logout({ redirectTo: "/login" })}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({
  href,
  children,
  onClick,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 transition-all"
    >
      {/* Subtle Background Slide-in */}
      <div className="absolute inset-0 bg-indigo-50/0 group-hover:bg-indigo-50 rounded-xl transition-colors duration-200 -z-10" />

      {/* Icon nudge animation */}
      <span className="text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform duration-200">
        {icon}
      </span>

      {children}
    </Link>
  );
}
