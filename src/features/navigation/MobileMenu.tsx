"use client";

import { BsCardList, BsJournalText } from "react-icons/bs";
import {
  IoCalendarOutline,
  IoListOutline,
  IoMenu,
  IoSettingsOutline,
} from "react-icons/io5";
import { SlNotebook } from "react-icons/sl";
import { BiX } from "react-icons/bi";
import { ReactNode, useEffect, useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { PiKanbanLight, PiUserCircleLight } from "react-icons/pi";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    label: "Dashboard",
    title: "Dashboard",
    url: "/dashboard",
    icon: <RxDashboard size={20} />,
  },
  {
    label: "Calendar",
    title: "Calendar",
    url: "/pages/calendar",
    icon: <IoCalendarOutline size={20} />,
  },
  {
    label: "Journal",
    title: "Journal",
    url: "/pages/journal",
    icon: <BsJournalText size={20} />,
  },
  {
    label: "Notes",
    title: "Notes",
    url: "/pages/notes",
    icon: <SlNotebook size={20} />,
  },
  {
    label: "My Tasks",
    title: "My Tasks",
    url: "/tasks",
    icon: <IoListOutline size={20} />,
  },
  {
    label: "My Lists",
    title: "My Lists",
    url: "/mylists",
    icon: <BsCardList size={20} />,
  },
  {
    label: "Planner",
    title: "Planner",
    url: "/tasks/planner",
    icon: <PiKanbanLight style={{ strokeWidth: "1" }} size={20} />,
  },
  {
    label: "Settings",
    title: "Settings",
    url: "/user/settings",
    icon: <IoSettingsOutline size={20} />,
  },
  {
    label: "Profile",
    title: "Profile",
    url: "/user/profile",
    icon: <PiUserCircleLight size={20} />,
  },
];

export default function MobileMenu({
  toggleButton,
}: {
  toggleButton?: ReactNode;
}) {
  const [viewMobileMenu, setViewMobileMenu] = useState(false);
  const pathname = usePathname();

  const isActive = (page: string) => pathname.split("/").includes(page);

  useEffect(() => {
    const handleEscape = (ev: globalThis.KeyboardEvent) => {
      if (ev.key === "Escape") {
        setViewMobileMenu(false);
      }
    };

    if (viewMobileMenu) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [viewMobileMenu]);

  return (
    <>
      <button title="Menu" onClick={() => setViewMobileMenu(true)}>
        {toggleButton ? (
          toggleButton
        ) : (
          <div className="p-2 bg-sky-900 hover:bg-sky-800 text-white duration-200 rounded-lg lg:hidden">
            <IoMenu size={25} />
          </div>
        )}
      </button>
      <div
        onClick={() => setViewMobileMenu(false)}
        className={
          (viewMobileMenu ? "" : "opacity-0 invisible") +
          " fixed inset-0 bg-zinc-900/50 duration-200 z-100 lg:hidden"
        }
      />
      <div
        className={
          (viewMobileMenu ? "" : "-translate-x-full") +
          " fixed top-0 left-0 h-full w-[80%] max-w-[300px] bg-zinc-200 text-zinc-900 duration-200 z-120 lg:hidden"
        }
      >
        <div className="flex items-center justify-between gap-4 p-4">
          <Link href="/" title="Home Page" className="flex items-center gap-2">
            <img src={"todo.svg"} alt="Logo" className="w-10" />
            <span className="font-bold text-xl">Taskit</span>
          </Link>
          <button onClick={() => setViewMobileMenu(false)}>
            <BiX size={25} />
          </button>
        </div>
        <div className="flex flex-col">
          {menuItems.map((item, idx) => (
            <Link
              href={item?.url}
              title={item?.title}
              key={idx}
              className={
                (isActive(item?.url) ? "" : "") +
                " duration-200 flex items-center gap-2 py-2 px-4 hover:bg-zinc-300 hover:text-black"
              }
              onClick={() => setViewMobileMenu(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
