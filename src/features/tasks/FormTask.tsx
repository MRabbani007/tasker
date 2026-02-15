"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { useCommandShortcut } from "@/hooks/useCommandShortcut";
import { FlagColorSelector } from "./FlagColorSelector";
import PrioritySelector from "./PrioritySelector";

// const COLORS = [
//   "bg-sky-500",
//   "bg-emerald-500",
//   "bg-amber-500",
//   "bg-orange-500",
//   "bg-rose-500",
//   "bg-slate-500",
// ];

export default function FormTask() {
  const { showForm, setShowForm, editItem } = useUser();
  const { visibility, toggle } = useTaskFormVisibility();
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

  const priority = watch("priority") ?? 1;
  const color = watch("color");

  useCommandShortcut({ key: "a", alt: false }, () =>
    setShowForm("CREATE_TASK"),
  );

  useEffect(() => {
    if (showForm === "EDIT_TASK" && editItem?.type === "task") {
      if (editItem?.data?.dueAt) {
        if (visibility.due === false) {
          toggle("due");
        }
      } else {
        if (visibility.due === true) {
          toggle("due");
        }
      }
    }
  }, [showForm, editItem]);

  useEffect(() => {
    if (showForm === "EDIT_TASK" && editItem?.type === "task") {
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
    } else if (showForm === "CREATE_TASK") {
      reset({
        ...T_Task,
        taskListId: editItem?.data.id ?? null,
      });
    }
  }, [showForm, editItem, reset]);

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

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isSubmit = (e.metaKey || e.ctrlKey) && e.key === "Enter";

      if (!isSubmit) return;

      // Prevent newline in textarea
      e.preventDefault();

      // Trigger react-hook-form submit
      handleSubmit(onSubmit)();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit, onSubmit]);

  return (
    <ModalForm
      title={showForm === "CREATE_TASK" ? "New Task" : "Update Task"}
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
      <div className="flex flex-col gap-4">
        <InputField
          placeholder="Context / Subject"
          {...register("title")}
          error={errors.title}
          className="flex-1"
        />

        <TextAreaField
          placeholder="Main Objective"
          {...register("task")}
          error={errors.task}
          autoFocus
        />

        <Expand show={visibility.details}>
          <TextAreaField
            placeholder="Additional details..."
            {...register("details")}
            error={errors.details}
          />
        </Expand>

        <div className="flex items-center gap-6">
          <Expand show={visibility.color}>
            <FlagColorSelector
              value={color}
              onChange={(v) => setValue("color", v)}
            />
          </Expand>

          <Expand show={visibility.priority}>
            <PrioritySelector
              value={priority}
              onChange={(p) => setValue("priority", p ?? 1)}
            />
          </Expand>

          <Expand show={visibility.due}>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Due</span>
              <InputField type="date" {...register("dueOn")} />
              <span className="text-zinc-500 ml-4">At</span>
              <InputField type="time" {...register("dueAt")} />
            </div>
          </Expand>
        </div>

        {/* 1. Quick Feature Toggles */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-100">
          <ToggleButton
            icon={<Flag size={18} />}
            label="Flag"
            onClick={() => toggle("color")}
            active={visibility.color}
          />
          <ToggleButton
            icon={<AlertCircle size={18} />}
            label="Priority"
            onClick={() => toggle("priority")}
            active={visibility.priority}
          />
          <ToggleButton
            icon={<Calendar size={18} />}
            label="Deadline"
            onClick={() => toggle("due")}
            active={visibility.due}
          />
          <ToggleButton
            icon={<AlignLeft size={18} />}
            label="Details"
            onClick={() => toggle("details")}
            active={visibility.details}
          />
          {/* <div className="h-4 w-px bg-slate-200 mx-1" /> */}
          {/* <button
            type="button"
            onClick={() => (allVisible ? hideAll() : showAll())}
            className="text-[10px] font-bold uppercase tracking-tighter text-indigo-600 hover:underline"
          >
            {allVisible ? "Simplify View" : "Show All Fields"}
          </button> */}
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
      {/* <span className="opacity-0 invisible md:opacity-100 md:visible w-0 md:w-fit">
        {label}
      </span> */}
    </button>
  );
}
