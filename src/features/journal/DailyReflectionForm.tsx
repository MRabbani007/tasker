"use client";

import React, { useState } from "react";

export interface JournalEntry {
  id: string;
  date: string;
  mood: "great" | "good" | "okay" | "bad" | "awful";
  energyLevel: number; // 1-10
  bigThreeWins: string[];
  gratitude: string[];
  dailyLearning: string;
  freeWriting: string;
}

export default function DailyReflectionForm() {
  const [mood, setMood] = useState<JournalEntry["mood"]>("okay");
  const [wins, setWins] = useState(["", "", ""]);

  const handleWinChange = (index: number, value: string) => {
    const newWins = [...wins];
    newWins[index] = value;
    setWins(newWins);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Daily Reflection
      </h2>

      {/* Mood & Energy Tracker */}
      <section className="mb-8">
        <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
          How are you feeling today?
        </label>
        <div className="flex gap-4 justify-between">
          {(["awful", "bad", "okay", "good", "great"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`p-3 rounded-lg border transition-all ${
                mood === m
                  ? "bg-blue-50 border-blue-500 scale-110"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              {m === "great"
                ? "🤩"
                : m === "good"
                  ? "😊"
                  : m === "okay"
                    ? "😐"
                    : m === "bad"
                      ? "😔"
                      : "😫"}
            </button>
          ))}
        </div>
      </section>

      {/* The Big Three Wins */}
      <section className="mb-8">
        <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
          The "Big Three" Wins
        </label>
        {wins.map((win, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Win #${i + 1}`}
            value={win}
            onChange={(e) => handleWinChange(i, e.target.value)}
            className="w-full mb-2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600"
          />
        ))}
      </section>

      {/* Daily Learning & Free Writing */}
      <section className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            What did you learn today?
          </label>
          <textarea
            rows={2}
            className="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600"
            placeholder="A new skill, a realization, or a mistake to avoid..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Free Writing / Brain Dump
          </label>
          <textarea
            rows={4}
            className="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600"
            placeholder="Anything else on your mind?"
          />
        </div>
      </section>

      <button className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
        Save Entry
      </button>
    </div>
  );
}
