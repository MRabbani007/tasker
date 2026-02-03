"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Search, Tag as TagIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock existing tags - replace with your DB fetch
const ALL_TAGS = ["Work", "Personal", "Urgent", "Reference", "Project-X"];

export function TagSelector({
  activeTags,
  onAdd,
  onRemove,
}: {
  activeTags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTags = ALL_TAGS.filter(
    (t) =>
      t.toLowerCase().includes(search.toLowerCase()) && !activeTags.includes(t),
  );

  const handleCreateNew = () => {
    if (search.trim()) {
      onAdd(search.trim());
      setSearch("");
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Plus Button Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-md hover:bg-slate-200 transition-colors text-slate-400"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
          >
            {/* Search Input */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 bg-slate-50/50">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                autoFocus
                placeholder="Find or create tag..."
                className="bg-transparent text-xs outline-none w-full text-slate-600"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateNew()}
              />
            </div>

            {/* Tags List */}
            <div className="max-h-48 overflow-y-auto p-1.5 flex flex-col gap-0.5">
              {filteredTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    onAdd(tag);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all text-left"
                >
                  <span className="flex items-center gap-2">
                    <TagIcon className="h-3 w-3 opacity-50" /> {tag}
                  </span>
                </button>
              ))}

              {search && !ALL_TAGS.includes(search) && (
                <button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-indigo-600 font-medium hover:bg-indigo-50 transition-all text-left"
                >
                  <Plus className="h-3 w-3" /> Create "{search}"
                </button>
              )}

              {filteredTags.length === 0 && !search && (
                <div className="p-4 text-center text-[10px] text-slate-400 italic">
                  No more tags available
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
