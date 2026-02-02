"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";

type User = {
  firstName: string;
  lastName: string | null;
  email: string;
};

export default function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  const initials =
    user.firstName.charAt(0).toUpperCase() +
    (user?.lastName ? user?.lastName.charAt(0).toUpperCase() : "");

  return (
    <div ref={menuRef} className="relative">
      {/* Avatar */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-blue-600 text-sm font-semibold shadow-md"
      >
        {initials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-64 rounded-xl bg-gray-900 border border-white/10 shadow-xl overflow-hidden"
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-white/40">
              <p className="text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>

            {/* Navigation */}
            <div className="flex flex-col text-sm">
              <MenuLink href="/dashboard">Dashboard</MenuLink>
              <MenuLink href="/lists">Lists</MenuLink>
              <MenuLink href="/tasks">Tasks</MenuLink>
              <MenuLink href="/journal">Journal</MenuLink>
              <MenuLink href="/notes">Notes</MenuLink>
              <MenuLink href="/settings" icon={<Settings size={14} />}>
                Settings
              </MenuLink>
              <button
                onClick={() => logoutAction()}
                className="flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-white/15 transition cursor-pointer"
              >
                <LogOut size={14} />
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
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 hover:bg-white/15 transition"
    >
      {icon}
      {children}
    </Link>
  );
}
