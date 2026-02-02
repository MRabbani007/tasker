"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  CornerDownLeft,
  FileCheck,
  ListChecks,
  NotebookPen,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Suggestion = {
  id: string;
  type: string;
  title: string;
  details: string;
};

const RECENT_SEARCHES_KEY = "tasker-recent-searches";

export default function SearchModal() {
  const { showSearchModal, setShowSearchModal } = useUser();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches on mount
  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch {}
      }
    };

    load();
  }, []);

  /* ----------------------------
   ⌘K / Ctrl+K / ESC shortcuts
  ----------------------------- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal(true);
      }
      if (e.key === "Escape") setShowSearchModal(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setShowSearchModal]);

  /* ----------------------------
     Fetch suggestions (debounced)
  ----------------------------- */
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!query.trim()) {
        setItems([]);
        return;
      }

      setLoading(true);
      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();
      setItems(data);
      setActiveIndex(0);
      setLoading(false);
    }, 250);

    return () => clearTimeout(t);
  }, [query]);

  /* ----------------------------
        Keyboard navigation
  ----------------------------- */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, items.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex < 0) {
        submit(query);
      } else {
        submit(items[activeIndex]?.title ?? query);
      }
    }
  };

  const submit = (value: string) => {
    if (!value.trim()) return;

    // Save to recent searches
    const updated = [value, ...recentSearches.filter((s) => s !== value)].slice(
      0,
      5,
    );
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));

    setShowSearchModal(false);
    router.push(`/search?query=${encodeURIComponent(value)}`);
  };

  const openLink = ({ title, id, type }: Suggestion) => {
    if (!title.trim()) return;

    // Save to recent searches
    const updated = [title, ...recentSearches.filter((s) => s !== title)].slice(
      0,
      5,
    );
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));

    setShowSearchModal(false);
    const href =
      type === "tasklist"
        ? `/lists?q=${title}`
        : type === "tasks"
          ? `/tasks?q=${title}`
          : type === "note"
            ? `/notes?q=${title}`
            : "#";

    router.push(href);
  };

  const categorizedItems = useMemo(() => {
    const groups: Record<string, Suggestion[]> = {};
    items.forEach((item) => {
      if (!groups[item.type]) groups[item.type] = [];
      groups[item.type].push(item);
    });
    return groups;
  }, [items]);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "task":
        return <FileCheck size={16} className="text-emerald-500" />;
      case "tasklist":
        return <ListChecks size={16} className="text-blue-500" />;
      case "note":
        return <NotebookPen size={16} className="text-amber-500" />;
      default:
        return <Search size={16} className="text-gray-400" />;
    }
  };

  /* ----------------------------
        Highlight match helper
  ----------------------------- */
  const highlight = (text: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span
          key={i}
          className="font-semibold text-primary-600 dark:text-primary-400"
        >
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  if (!showSearchModal) return null;

  return (
    <AnimatePresence mode="wait">
      {showSearchModal && (
        <motion.div
          onClick={() => setShowSearchModal(false)}
          className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/40 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Palette */}
          <motion.div
            initial={{ y: -20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -20, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="mt-24 w-full max-w-xl overflow-hidden rounded-2xl bg-white/90 shadow-2xl ring-1 ring-zinc-200 dark:bg-zinc-900/90 dark:ring-zinc-800"
          >
            {/* Input Section */}
            <div className="flex items-center gap-3 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <Search size={20} className="text-zinc-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search anything..."
                className="flex-1 bg-transparent text-lg text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
              />
              <div className="flex items-center gap-1.5">
                <kbd className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                  ESC
                </kbd>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full"
                  />
                </div>
              )}

              {/* Recent Searches */}
              {!query && recentSearches.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Recent Searches
                  </div>
                  {recentSearches.map((s, i) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        i === activeIndex
                          ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50",
                      )}
                    >
                      <Clock
                        size={16}
                        className="text-zinc-400 group-hover:text-primary-500"
                      />
                      <span className="flex-1">{s}</span>
                      <ArrowRight
                        size={14}
                        className={cn(
                          "opacity-0 transition-opacity",
                          i === activeIndex && "opacity-100",
                        )}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* No results */}
              {!loading && query && items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search
                    size={40}
                    className="mb-4 text-zinc-200 dark:text-zinc-800"
                  />
                  <p className="text-sm text-zinc-500">
                    {`No results found for "${query}"`}
                  </p>
                </div>
              )}

              {/* Categorized Results */}
              {!loading &&
                query &&
                Object.entries(categorizedItems).map(([category, catItems]) => (
                  <div key={category} className="p-2">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {category}s
                    </div>
                    {catItems.map((item) => {
                      const globalIndex = items.indexOf(item);
                      const isSelected = globalIndex === activeIndex;
                      return (
                        <div
                          key={item.id}
                          onMouseEnter={() => setActiveIndex(globalIndex)}
                          className={cn(
                            "group flex justify-start items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all",
                            isSelected
                              ? "bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:ring-primary-900/50"
                              : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/50",
                          )}
                        >
                          <button
                            onClick={() => submit(item.details)}
                            className="flex-1 flex justify-start items-center gap-3"
                          >
                            <div
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-zinc-800",
                                isSelected &&
                                  "bg-primary-100 dark:bg-primary-900/40",
                              )}
                            >
                              {getTypeIcon(item.type)}
                            </div>
                            <div className="flex-1 flex flex-col items-start overflow-hidden">
                              <p className="truncate font-medium">
                                {highlight(item.title)}
                              </p>
                              <p className="truncate text-xs text-zinc-400 dark:text-zinc-500">
                                {item.details}
                              </p>
                            </div>
                          </button>
                          {isSelected && (
                            <button
                              onClick={() => openLink(item)}
                              className="flex items-center gap-1 text-[10px] font-medium text-primary-500"
                            >
                              <span>Open</span>
                              <CornerDownLeft size={10} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
            </div>

            {/* Footer Hints */}
            <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50/50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-950/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <kbd className="rounded border border-zinc-200 bg-white px-1 py-0.5 text-[10px] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                    ↑
                  </kbd>
                  <kbd className="rounded border border-zinc-200 bg-white px-1 py-0.5 text-[10px] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                    ↓
                  </kbd>
                  <span className="text-[10px] text-zinc-400">to navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="rounded border border-zinc-200 bg-white px-1 py-0.5 text-[10px] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                    ↵
                  </kbd>
                  <span className="text-[10px] text-zinc-400">to select</span>
                </div>
              </div>
              <div className="text-[10px] text-zinc-400">
                Russky Search v1.0
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
