"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  NotepadText,
  NotebookPen,
  CheckCircle2,
  ListFilter,
  Kanban,
  Settings,
  LogOut,
  Info,
  Sparkles,
  CreditCard,
  Mail,
} from "lucide-react";
import { MdOutlineTaskAlt } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useSession } from "@/context/SessionProvider";

const menuItems = [
  // { label: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { label: "My Tasks", url: "/tasks", icon: CheckCircle2 },
  { label: "Collections", url: "/lists", icon: ListFilter },
  { label: "Calendar", url: "/calendar", icon: Calendar },
  { label: "Kanban", url: "/kanban", icon: Kanban },
  { label: "Journal", url: "/journal", icon: NotepadText },
  { label: "Notes", url: "/notes", icon: NotebookPen },
  // { label: "Settings", url: "/settings", icon: Settings },
  // { label: "Profile", url: "/profile", icon: User },
];

const guestItems = [
  { label: "About", url: "/about", icon: Info },
  { label: "Features", url: "/features", icon: Sparkles },
  { label: "Pricing", url: "/pricing", icon: CreditCard },
  { label: "Contact Us", url: "/contact", icon: Mail },
];

export default function MobileMenu({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { authenticated, user, logout } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/10 backdrop-blur z-100 lg:hidde"
            />

            {/* Side Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-70 h-dvh bg-white shadow-2xl z-120 flex flex-col overflow-hidden lg:hidde"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                {authenticated ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 group"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-indigo-200 shadow-lg group-hover:scale-105 transition-transform">
                      <span className="font-bold">
                        {user?.firstName?.[0] || "U"}
                      </span>
                    </div>
                    {
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-slate-800 truncate">
                          {user?.firstName || "User"}
                        </span>
                        <span className="text-[10px] font-medium text-indigo-500 uppercase tracking-wider">
                          Pro Plan
                        </span>
                      </div>
                    }
                  </Link>
                ) : (
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                      <MdOutlineTaskAlt size={20} />
                    </div>
                    <span className="font-bold text-lg text-slate-800 tracking-tight">
                      Tasker
                    </span>
                  </Link>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {(authenticated ? menuItems : guestItems).map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <Link
                      key={item.url}
                      href={item.url}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                        isActive
                          ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      <item.icon
                        size={20}
                        className={
                          isActive ? "text-indigo-600" : "text-slate-400"
                        }
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="border-t border-slate-100 p-4 space-y-1">
                {authenticated ? (
                  <>
                    <Link
                      href="/settings"
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-500 transition-all hover:bg-slate-50",
                      )}
                    >
                      <Settings size={20} className="shrink-0" />
                      {<span className="text-sm font-medium">Settings</span>}
                    </Link>
                    <button
                      onClick={() => logout({ redirectTo: "/login" })}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-rose-500 transition-all hover:bg-rose-50",
                      )}
                    >
                      <LogOut size={20} className="shrink-0" />
                      {<span className="text-sm font-medium">Logout</span>}
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-indigo-200 shadow-lg hover:bg-indigo-700 transition-all hover:shadow-indigo-300"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
