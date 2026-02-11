"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function OverdueAlert({ count }: { count: number }) {
  const [isVisible, setIsVisible] = useState(true);

  if (count === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          // Slide and Fade Entrance
          initial={{ height: 0, opacity: 0, marginBottom: 0 }}
          animate={{ height: "auto", opacity: 1, marginBottom: 24 }}
          exit={{ height: 0, opacity: 0, marginBottom: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative overflow-hidden bg-rose-600 text-white rounded-3xl shadow-xl shadow-rose-200/50"
        >
          {/* Animated Background Glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl pointer-events-none"
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 md:px-8">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30"
              >
                <AlertTriangle size={24} className="text-white" />
              </motion.div>

              <div>
                <h4 className="text-sm font-black uppercase tracking-[0.15em] mb-0.5">
                  Critical Overdue
                </h4>
                <p className="text-xs font-semibold text-rose-100 opacity-90">
                  {count} high-priority {count === 1 ? "task is" : "tasks are"}{" "}
                  blocking your progress.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/tasks?filter=critical"
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                Resolve Now <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 text-rose-200 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
