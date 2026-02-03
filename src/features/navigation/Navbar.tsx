"use client";

import Link from "next/link";
import { MdOutlineTaskAlt } from "react-icons/md";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";
import UserSearchTrigger from "@/components/UserSearchTrigger";
import { usePathname } from "next/navigation";
import { userPages } from "@/lib/shared";

export default function Navbar({ user }: { user?: User }) {
  const pathname = usePathname().split("/")[1];

  const onUserPage = userPages.includes(pathname);

  if (onUserPage) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-linear-to-l from-cyan-950 to-gray-950 text-white backdrop-blur">
      <div className="px-4 py-4 flex items-center justify-between gap-4">
        {/* Left – Logo */}
        <Link
          href="/"
          title="Tasker Home"
          className="flex items-center gap-2 font-semibold text-xl"
        >
          <MdOutlineTaskAlt size={26} />
          <span>Tasker</span>
        </Link>

        {/* Center – Marketing links */}
        {!user && (
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-4">
              <NavLink href="/about">About</NavLink>
              <NavLink href="/features">Features</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
            </div>
          </div>
        )}

        {/* Right */}
        <div className="flex items-center gap-4">
          <MobileMenu />

          {user ? (
            <>
              <UserSearchTrigger />
              <UserMenu user={user} />
            </>
          ) : (
            <Link
              href="/login"
              className="hidden lg:inline-flex items-center rounded-xl bg-cyan-600 px-5 py-2 text-sm font-medium hover:bg-cyan-500 transition"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-gray-300 hover:text-white transition"
    >
      {children}
    </Link>
  );
}
