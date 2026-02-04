"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Calendar, Flag, AlertCircle, Type, AlignLeft } from "lucide-react";

import InputField from "@/components/forms/InputField";
import TextAreaField from "@/components/ui/TextAreaField";
import ModalForm from "@/components/ui/ModalForm";
import { useUser } from "@/context/UserContext";
import { createTask, deleteTask, updateTask } from "@/lib/actions/user/tasks";
import { TaskInput, TaskSchema } from "@/lib/schemas/task";
import { T_Task } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { useTaskFormVisibility } from "@/hooks/useTaskFormVisibility";
import { Expand } from "@/components/Expand";

const COLORS = [
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-slate-500",
];

export default function FormTask() {
  const { showForm, setShowForm, editItem } = useUser();
  const { visibility, toggle, showAll, hideAll } = useTaskFormVisibility();
  const isOpen = showForm === "CREATE_TASK" || showForm === "EDIT_TASK";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(TaskSchema),
    defaultValues: { ...T_Task, priority: 1, color: "bg-slate-500" },
  });

  const priority = watch("priority");
  const color = watch("color");
  const allVisible = Object.values(visibility).every(Boolean);

  // Sync data on Edit
  useEffect(() => {
    if (isOpen && editItem?.type === "task") {
      reset({
        ...T_Task,
        ...editItem.data,
        dueOn: editItem.data.dueAt
          ? editItem.data.dueAt.toISOString().slice(0, 10)
          : undefined,

        dueAt: editItem.data.dueAt
          ? editItem.data.dueAt.toISOString().slice(11, 16)
          : undefined,
      });
    }
  }, [isOpen, editItem, reset]);

  const onSubmit: SubmitHandler<TaskInput> = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined && val !== null) formData.append(key, String(val));
    });

    try {
      const action = showForm === "CREATE_TASK" ? createTask : updateTask;
      const res = await action(formData);
      if (res.status === 200) {
        toast.success(
          showForm === "CREATE_TASK" ? "Objective captured" : "Changes synced",
        );
        setShowForm("");
      }
    } catch {
      toast.error("Network synchronization failed");
    }
  };

  return (
    <ModalForm
      title={
        showForm === "CREATE_TASK" ? "Capturing Objective" : "Refining Task"
      }
      isOpen={isOpen}
      setShowForm={setShowForm}
      onReset={() => setShowForm("")}
      onSubmit={handleSubmit(onSubmit)}
      loading={isSubmitting}
      type={showForm === "CREATE_TASK" ? "add" : "edit"}
      deleteButton={showForm === "EDIT_TASK"}
      onDelete={async () => {
        if (confirm("Permanently archive this task?")) {
          if (editItem?.type === "task") {
            await deleteTask(editItem?.data?.id);
            setShowForm("");
          }
        }
      }}
      maxW="max-w-3xl"
    >
      <div className="space-y-8">
        {/* 1. Quick Feature Toggles */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-100">
          <ToggleButton
            icon={<Type size={12} />}
            label="Title"
            onClick={() => toggle("title")}
            active={visibility.title}
          />
          <ToggleButton
            icon={<AlignLeft size={12} />}
            label="Description"
            onClick={() => toggle("details")}
            active={visibility.details}
          />
          <ToggleButton
            icon={<Calendar size={12} />}
            label="Deadline"
            onClick={() => toggle("due")}
            active={visibility.due}
          />
          <ToggleButton
            icon={<AlertCircle size={12} />}
            label="Priority"
            onClick={() => toggle("priority")}
            active={visibility.priority}
          />
          <ToggleButton
            icon={<Flag size={12} />}
            label="Flag"
            onClick={() => toggle("color")}
            active={visibility.color}
          />
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <button
            type="button"
            onClick={() => (allVisible ? hideAll() : showAll())}
            className="text-[10px] font-bold uppercase tracking-tighter text-indigo-600 hover:underline"
          >
            {allVisible ? "Simplify View" : "Show All Fields"}
          </button>
        </div>

        {/* 2. Main Content Area */}
        <div className="space-y-6">
          <Expand show={visibility.title}>
            <InputField
              label="Context / Subject"
              placeholder="e.g. Q1 Marketing"
              {...register("title")}
              error={errors.title}
            />
          </Expand>

          <TextAreaField
            label="Main Objective"
            placeholder="Describe the core task..."
            {...register("task")}
            error={errors.task}
            autoFocus
          />

          <Expand show={visibility.details}>
            <TextAreaField
              label="Strategic Details"
              placeholder="Additional context or requirements..."
              {...register("details")}
              error={errors.details}
            />
          </Expand>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Expand show={visibility.due}>
              <div className="space-y-4">
                <InputField
                  label="Due Date"
                  type="date"
                  {...register("dueOn")}
                />
                <InputField
                  label="Specific Time"
                  type="time"
                  {...register("dueAt")}
                />
              </div>
            </Expand>

            <div className="space-y-6">
              <Expand show={visibility.priority}>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    Priority Level
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setValue("priority", p)}
                        className={cn(
                          "w-10 h-10 rounded-xl border-2 font-bold transition-all flex items-center justify-center",
                          priority === p
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110"
                            : "bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100",
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </Expand>

              <Expand show={visibility.color}>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    Identify Flag
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setValue("color", c)}
                        className={cn(
                          "w-7 h-7 rounded-full transition-all ring-offset-4 shadow-sm",
                          c,
                          color === c
                            ? "ring-2 ring-indigo-500 scale-110"
                            : "hover:scale-125",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </Expand>
            </div>
          </div>
        </div>
      </div>
    </ModalForm>
  );
}

function ToggleButton({
  label,
  icon,
  onClick,
  active,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all uppercase tracking-tight",
        active
          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
