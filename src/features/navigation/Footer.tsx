"use client";

import { userPages } from "@/lib/shared";
import Link from "next/link";
import { MdOutlineTaskAlt } from "react-icons/md";
import { FaTwitter, FaGithub, FaDiscord } from "react-icons/fa";
import { usePathname } from "next/navigation";

const footerLinks = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Changelog", href: "/changelog" },
    { label: "Docs", href: "/docs" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ],
};

export default function Footer() {
  const pathname = usePathname().split("/")[1];

  const onUserPage = userPages.includes(pathname);

  const currentYear = new Date().getFullYear();

  if (onUserPage) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200 bg-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 pr-8">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-indigo-100 shadow-lg">
                <MdOutlineTaskAlt size={20} />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">
                Tasker
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              The modern task manager for high-performance teams. Built for
              clarity, speed, and focus.
            </p>
            <div className="flex gap-4 mt-6">
              <SocialIcon href="#" icon={<FaTwitter />} label="Twitter" />
              <SocialIcon href="#" icon={<FaGithub />} label="GitHub" />
              <SocialIcon href="#" icon={<FaDiscord />} label="Discord" />
            </div>
          </div>

          {/* Dynamic Link Columns */}
          <FooterColumn title="Product" links={footerLinks.product} />
          <FooterColumn title="Company" links={footerLinks.company} />
          <FooterColumn title="Legal" links={footerLinks.legal} />
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-medium">
            © {currentYear} Tasker Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/status"
              className="flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:opacity-80 transition"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Systems Operational
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100"
    >
      {icon}
    </Link>
  );
}
