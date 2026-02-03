"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pagination({
  page,
  count,
  className,
  itemsPerPage = 15,
}: {
  page: number;
  count: number;
  itemsPerPage?: number;
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(count / itemsPerPage);
  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Logic to show "..." for many pages
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <nav className={cn("flex items-center justify-center gap-1", className)}>
      {/* Previous Button */}
      <button
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getVisiblePages().map((p, idx) =>
          p === "..." ? (
            <div key={`dots-${idx}`} className="px-2 text-slate-400">
              <MoreHorizontal size={14} />
            </div>
          ) : (
            <button
              key={p}
              onClick={() => handlePageChange(Number(p))}
              className={cn(
                "min-w-9 h-9 rounded-xl text-sm font-semibold transition-all",
                page === p
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              {p}
            </button>
          ),
        )}
      </div>

      {/* Next Button */}
      <button
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
        className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
