"use client";

import { User } from "lucide-react";
import { useForm } from "react-hook-form";

export function ProfileSettings() {
  const { register, handleSubmit } = useForm({
    defaultValues: { name: "Alex Admin", email: "alex@example.com" },
  });

  const onSubmit = () => console.log("Profile Updated");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-8">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Public Profile</h3>
        <p className="text-sm text-slate-500">
          This information will be displayed publicly.
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200">
          <User size={32} />
        </div>
        <button
          type="button"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Change Avatar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full Name
          </label>
          <input
            {...register("name")}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <input
            {...register("email")}
            type="email"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
      >
        Save Changes
      </button>
    </form>
  );
}
