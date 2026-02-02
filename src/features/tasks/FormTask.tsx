"use client";

import InputField from "@/components/forms/InputField";
import ModalForm from "@/components/ui/ModalForm";
import { useUser } from "@/context/UserContext";
import { createTask, deleteTask, updateTask } from "@/lib/actions/user/tasks";
import { TaskInput, TaskSchema } from "@/lib/schemas/task";
import { T_Task } from "@/lib/templates";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTaskFormVisibility } from "@/hooks/useTaskFormVisibility";
import { Expand } from "@/components/Expand";
import { object } from "zod";

function mergeDateAndTime(date?: string, time?: string) {
  if (!date) return null;
  const d = new Date(date);
  if (time) {
    const [h, m] = time.split(":").map(Number);
    d.setHours(h, m, 0, 0);
  }
  return d;
}

const COLORS = [
  "bg-sky-600",
  "bg-green-600",
  "bg-yellow-500",
  "bg-orange-600",
  "bg-red-600",
  "bg-zinc-600",
];

export default function FormTask() {
  const { showForm, setShowForm, editItem } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(TaskSchema),
    defaultValues: { ...T_Task, priority: 1 },
  });

  const { visibility, toggle, showAll, hideAll } = useTaskFormVisibility();
  const allVisible = Object.values(visibility).every(Boolean);

  /** ---------------- Populate on Edit ---------------- */
  useEffect(() => {
    if (showForm === "EDIT_TASK" && editItem?.type === "task") {
      const task = editItem.data;

      reset({
        ...T_Task,
        ...task,
        // dueOn: task.dueOn
        //   ? new Date(task.dueOn).toISOString().slice(0, 10)
        //   : "",
        // dueAt: task.dueOn
        //   ? new Date(task.dueOn).toISOString().slice(11, 16)
        //   : "",
      });
    }

    if (showForm === "CREATE_TASK" && editItem?.type === "tasklist") {
      reset({
        ...T_Task,
        taskListId: editItem.data.id,
      });
    }
  }, [showForm, editItem, reset]);

  /** ---------------- Submit ---------------- */
  const onSubmit: SubmitHandler<TaskInput> = async (data) => {
    const dueOn = mergeDateAndTime(
      data.dueOn?.toDateString(),
      data.dueAt?.toDateString(),
    );

    const payload = {
      ...data,
      dueOn,
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    try {
      let result;
      let message = "";

      if (showForm === "CREATE_TASK") {
        result = await createTask(formData);
        message = "Task added";
      } else {
        result = await updateTask(formData);
        message = "Task saved";
      }

      if (result?.status === 200) {
        toast.success(message);
        setShowForm("");
      } else {
        toast.error("Something went wrong");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  /** ---------------- Delete ---------------- */
  const handleDelete = async () => {
    if (!editItem?.data?.id) return;
    if (!confirm("Delete this task?")) return;

    try {
      await deleteTask(editItem.data.id);
      toast.success("Task deleted");
      setShowForm("");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const priority = watch("priority");
  const color = watch("color");

  return (
    <ModalForm
      title={showForm === "CREATE_TASK" ? "Add Task" : "Edit Task"}
      isOpen={showForm === "CREATE_TASK" || showForm === "EDIT_TASK"}
      setShowForm={setShowForm}
      onReset={() => setShowForm("")}
      onSubmit={handleSubmit(onSubmit)}
      disabled={isSubmitting}
      type={showForm === "CREATE_TASK" ? "add" : "edit"}
      deleteButton={showForm === "EDIT_TASK"}
      onDelete={handleDelete}
      maxW="max-w-5xl"
    >
      <div className="flex flex-wrap justify-center gap-2">
        <ToggleButton
          label="Title"
          onClick={() => toggle("title")}
          active={visibility.title}
        />
        <ToggleButton
          label="Details"
          onClick={() => toggle("details")}
          active={visibility.details}
        />
        <ToggleButton
          label="Notes"
          onClick={() => toggle("notes")}
          active={visibility.notes}
        />
        <ToggleButton
          label="Due"
          onClick={() => toggle("due")}
          active={visibility.due}
        />
        <ToggleButton
          label="Priority"
          onClick={() => toggle("priority")}
          active={visibility.priority}
        />
        <ToggleButton
          label="Flag"
          onClick={() => toggle("color")}
          active={visibility.color}
        />
        <ToggleButton
          label={allVisible ? "X" : "All"}
          onClick={() => (allVisible ? hideAll() : showAll())}
          active={allVisible}
        />
      </div>
      <Expand show={visibility.title}>
        <InputField
          label="Title"
          placeholder="Task title"
          {...register("title")}
          error={errors.title}
        />
      </Expand>
      <InputField
        label="Task"
        placeholder="What needs to be done?"
        {...register("task")}
        error={errors.task}
        autoFocus
      />
      <Expand show={visibility.details}>
        <InputField
          label="Details"
          placeholder="Additional details"
          {...register("details")}
          error={errors.details}
        />
      </Expand>
      <Expand show={visibility.notes}>
        <InputField
          label="Notes"
          placeholder="Optional notes"
          {...register("notes")}
          error={errors.notes}
        />
      </Expand>
      <Expand show={visibility.due}>
        {/* Due Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Due date" type="date" {...register("dueOn")} />
          <InputField label="Due time" type="time" {...register("dueAt")} />
        </div>
      </Expand>
      <div className="grid grid-cols-2 gap-4">
        <Expand show={visibility.priority}>
          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setValue("priority", p)}
                  className={`w-9 h-9 rounded-full border text-sm font-medium transition
                ${
                  priority === p
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-zinc-100 hover:bg-zinc-200"
                }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </Expand>
        <Expand show={visibility.color}>
          {/* color Picker */}
          <div>
            <label className="block text-sm font-medium mb-2">Flag</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue("color", c)}
                  className={`w-7 h-7 rounded-full ${c} ring-offset-2 transition
            ${color === c ? "ring-2 ring-black" : "hover:scale-110"}`}
                />
              ))}
            </div>
          </div>
        </Expand>
      </div>
    </ModalForm>
  );
}

function ToggleButton({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-3 py-1 rounded-full border transition
        ${
          active
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-zinc-100 hover:bg-zinc-200"
        }`}
    >
      {label}
    </button>
  );
}
