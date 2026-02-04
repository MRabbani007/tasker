"use client";
import React, { useState } from "react";

export const JournalForm = () => {
  const [mood, setMood] = useState("neutral");

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-medium mb-6">Today's Reflection</h3>

      <form className="space-y-6">
        {/* Mood Selector */}
        <div>
          <label className="block text-sm font-medium mb-3">
            How are you feeling?
          </label>
          <div className="flex space-x-4">
            {["😔", "😐", "😊", "🔥"].map((emoji, i) => (
              <button
                type="button"
                key={i}
                className="text-2xl p-3 hover:bg-blue-50 rounded-xl transition-all border border-transparent active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Big Three Wins */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">Big Three Wins</label>
          {[1, 2, 3].map((i) => (
            <input
              key={i}
              className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder={`Win #${i}`}
            />
          ))}
        </div>

        {/* Free Writing */}
        <div>
          <label className="block text-sm font-medium mb-2">
            What's on your mind?
          </label>
          <textarea
            rows={4}
            className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Braindump your thoughts here..."
          />
        </div>

        <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
          Complete Reflection
        </button>
      </form>
    </div>
  );
};
