"use client";

import { createTask } from "@/lib/actions/user/tasks";
import { TaskInput, TaskSchema } from "@/lib/schemas/task";
import { T_Task } from "@/lib/templates";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Zap } from "lucide-react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function QuickCapture() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(TaskSchema),
    defaultValues: { ...T_Task, priority: 1, color: "bg-slate-500" },
  });

  const onSubmit: SubmitHandler<TaskInput> = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined && val !== null) formData.append(key, String(val));
    });

    try {
      const res = await createTask(formData);
      if (res.status === 200) {
        toast.success("Objective captured");
      }
    } catch {
      toast.error("Network synchronization failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="md:col-span-4 lg:col-span-3 p-6 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group"
    >
      <div className="relative z-10">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap size={18} className="fill-white" /> Quick Capture
        </h3>
        <div className="relative">
          <input
            {...register("task")} // Connects to your TaskSchema
            disabled={isSubmitting}
            type="text"
            placeholder="I need to..."
            className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-sm placeholder:text-indigo-200 outline-none focus:bg-white/20 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white text-indigo-600 rounded-xl hover:scale-105 transition-transform disabled:scale-100 disabled:bg-indigo-200"
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        </div>
        <p className="text-[10px] mt-3 font-medium text-indigo-100/70 uppercase tracking-widest">
          {isSubmitting ? "Capturing..." : "Press Enter to save to Inbox"}
        </p>
      </div>
    </form>
  );
}
