"use client";

import { useState } from "react";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import Link from "next/link";
import {
  Calendar,
  ChartGantt,
  CircleCheckBig,
  ListChecks,
  LogOut,
  NotebookPen,
  NotepadText,
  Settings,
  UserRound,
  UserRoundCog,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    label: "My Tasks",
    icon: <CircleCheckBig size={25} />,
    url: "/tasks",
  },
  {
    label: "My Lists",
    url: "/lists",
    icon: <ListChecks size={25} />,
  },
  {
    label: "Calendar",
    icon: <Calendar size={25} />,
    url: "/calendar",
  },
  {
    label: "Kanban",
    icon: <ChartGantt size={25} />,
    url: "/kanban",
  },
  {
    label: "Journal",
    url: "/journal",
    icon: <NotepadText size={25} />,
  },
  {
    label: "Notes",
    url: "/notes",
    icon: <NotebookPen size={25} />,
  },
];

const adminItems = [
  {
    label: "Admin",
    icon: <UserRoundCog size={28} />,
    url: "",
    children: [
      {
        label: "Users",
        url: "/admin/users",
        icon: <UsersRound size={25} />,
      },
      {
        label: "Lists",
        url: "/admin/lists",
        icon: <ListChecks size={25} />,
      },
    ],
  },
];

export default function Sidebar({ user }: { user?: User }) {
  const [collapsed, setCollapsed] = useState(true);

  const isAdmin = false;

  let menuItems = isAdmin ? [...items, ...adminItems] : [...items];

  return (
    <aside
      className={
        (collapsed ? "" : "w-40") +
        " hidden lg:flex flex-col bg-cyan-950 text-zinc-100 duration-300 py-4"
      }
    >
      <Link
        href={"/dashboard"}
        className="flex items-center justify-center py-2 px-2 rounded-full hover:bg-zinc-800 duration-200"
      >
        <UserRound size={25} />
        <span
          className={`whitespace-nowrap ${
            collapsed ? "w-0 invisible opacity-0" : "w-20 ml-2"
          } transition-all duration-300`}
        >
          {user?.firstName?.[0]}
        </span>
      </Link>
      <button
        title={collapsed ? "Expand" : "Collapse"}
        onClick={() => setCollapsed((curr) => !curr)}
        className="mx-auto py-2 px-4 rounded-md bg-zinc-20"
      >
        <MdOutlineKeyboardDoubleArrowRight
          size={20}
          className={collapsed ? "" : "rotate-180" + " duration-200 "}
        />
      </button>
      <div className="flex-1 flex flex-col">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.url}
            className={cn(
              "hover:bg-zinc-800 relative py-2 px-2 flex items-center gap-2 duration-200",
              collapsed ? " flex justify-center " : "",
            )}
          >
            {item.icon}
            <span
              className={`whitespace-nowrap ${
                collapsed ? "hidden" : "block"
              } transition-all duration-300`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
      <div className="border-t border-zinc-100 p-3 dark:border-zinc-800">
        <nav className="space-y-1">
          <Link
            href="/admin/settings"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
              collapsed && "justify-center",
            )}
          >
            <Settings size={20} className="shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium">Settings</span>
            )}
          </Link>

          <button
            onClick={() => {
              // onLogout?.();
              // router.push("/login");
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-500 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20",
              collapsed && "justify-center",
            )}
          >
            <LogOut size={20} className="shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </nav>

        {!collapsed && (
          <div className="mt-4 px-3 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Logged in as
            </p>
            <p className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {user?.firstName}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
