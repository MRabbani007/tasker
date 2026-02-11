"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Coffee, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type TimerMode = "work" | "break";

export default function PomodoroTimerCard() {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);

  // Constants for durations
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  useEffect(() => {
    const handleTimerEnd = () => {
      setIsActive(false);
      if (mode === "work") {
        setSessions((prev) => prev + 1);
        setMode("break");
        setTimeLeft(BREAK_TIME);
        // Optional: Play a notification sound here
      } else {
        setMode("work");
        setTimeLeft(WORK_TIME);
      }
    };

    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerEnd();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMode("work");
    setTimeLeft(WORK_TIME);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "md:col-span-2 lg:col-span-2 p-6 rounded-3xl border transition-all duration-500",
        mode === "work"
          ? "bg-white border-slate-200"
          : "bg-emerald-50 border-emerald-100",
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {mode === "work" ? (
            <Zap className="text-indigo-600" size={18} />
          ) : (
            <Coffee className="text-emerald-600" size={18} />
          )}
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {mode === "work" ? "Focus Session" : "Short Break"}
          </span>
        </div>
        <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          Session #{sessions + 1}
        </div>
      </div>

      <div className="text-center py-4">
        <h2
          className={cn(
            "text-5xl font-black tracking-tighter mb-6 transition-colors",
            mode === "work" ? "text-slate-900" : "text-emerald-700",
          )}
        >
          {formatTime(timeLeft)}
        </h2>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={toggleTimer}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl transition-all shadow-lg",
              isActive
                ? "bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800"
                : "bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700",
            )}
          >
            {isActive ? (
              <Pause size={20} />
            ) : (
              <Play size={20} className="ml-1" />
            )}
          </button>

          <button
            onClick={resetTimer}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 space-y-2">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-1000",
              mode === "work" ? "bg-indigo-600" : "bg-emerald-500",
            )}
            style={{
              width: `${(timeLeft / (mode === "work" ? WORK_TIME : BREAK_TIME)) * 100}%`,
            }}
          />
        </div>
        <p className="text-[10px] text-center font-medium text-slate-400">
          {isActive ? "Deep work in progress..." : "Ready to start?"}
        </p>
      </div>
    </div>
  );
}
