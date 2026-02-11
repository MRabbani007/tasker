"use client";

import { AppPreferences } from "@/features/settings/AppPreferences";
import { NotificationSettings } from "@/features/settings/NotificationSettings";
import { ProfileSettings } from "@/features/settings/ProfileSettings";
import { cn } from "@/lib/utils";
import { Bell, Sliders, User } from "lucide-react";
import { useState } from "react";

const SETTINGS_TABS = [
  { id: "profile", label: "Profile", icon: <User size={18} /> },
  { id: "preferences", label: "Preferences", icon: <Sliders size={18} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="py-10 px-8 flex-1 flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 space-y-4">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  : "text-slate-500 hover:bg-slate-100",
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "preferences" && <AppPreferences />}
          {activeTab === "notifications" && <NotificationSettings />}
        </main>
      </div>
    </div>
  );
}
