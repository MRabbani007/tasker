"use client";

import InputField from "@/components/ui/InputField";
import ModalForm from "@/components/ui/ModalForm";
import { useUser } from "@/context/UserContext";
import { useCommandShortcut } from "@/hooks/useCommandShortcut";
import {
  createTaskList,
  deleteTaskList,
  updateTaskList,
} from "@/lib/actions/user/tasklists";
import { TaskListInput, TaskListSchema } from "@/lib/schemas/taskList";
import { T_TaskList } from "@/lib/templates";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function FormTaskList() {
  const { showForm, setShowForm, editItem } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(TaskListSchema),
    defaultValues: { ...T_TaskList },
  });

  useEffect(() => {
    if (showForm === "EDIT_LIST" && editItem?.type === "tasklist") {
      reset({
        ...T_TaskList,
        ...editItem?.data,
      });
    } else if (showForm === "CREATE_LIST") {
      reset({
        ...T_TaskList,
      });
    }
  }, [showForm, editItem, reset]);

  const onSubmit: SubmitHandler<TaskListInput> = async (data) => {
    // ... (Your submission logic from the previous answer remains the same)
    const formData = new FormData();
    for (const key of Object.keys(data)) {
      formData.append(key, data[key as keyof typeof data] as string);
    }

    try {
      let result = null;
      let message = "";

      if (showForm === "CREATE_LIST") {
        result = await createTaskList(formData);
        message = "List created";
      } else if (showForm === "EDIT_LIST") {
        result = await updateTaskList(formData);
        message = "List saved";
      }

      if (result?.status === 200) {
        toast.success(message);
        setShowForm("");
      } else if (result?.status === 400) {
        toast.error("Provide required information");
      } else {
        toast.error("Something went wrong!");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this list?")) {
      try {
        if (editItem?.type === "tasklist") {
          await deleteTaskList(editItem?.data?.id);
          setShowForm("");
        }
      } catch {}
    }
  };

  useCommandShortcut({ key: "c", alt: false }, () =>
    setShowForm("CREATE_LIST"),
  );

  return (
    <ModalForm
      title={
        showForm === "CREATE_LIST"
          ? "Create List"
          : showForm === "EDIT_LIST"
            ? "Edit List"
            : ""
      }
      isOpen={showForm === "CREATE_LIST" || showForm === "EDIT_LIST"}
      setShowForm={setShowForm}
      onReset={() => setShowForm("")}
      onSubmit={handleSubmit(onSubmit)}
      disabled={isSubmitting}
      type={showForm === "CREATE_LIST" ? "add" : "edit"}
      maxW="max-w-5xl"
      deleteButton={true}
      onDelete={handleDelete}
    >
      <div className="flex flex-col gap-4">
        <InputField
          type="text"
          placeholder="Collection Name / Title"
          {...register("title")}
          error={errors.title}
          autoFocus
        />
        <InputField
          type="text"
          placeholder="Subtitle"
          {...register("subtitle")}
          error={errors.subtitle}
        />
        <InputField
          type="text"
          placeholder="Details"
          {...register("details")}
          error={errors.details}
        />
      </div>
    </ModalForm>
  );
}
