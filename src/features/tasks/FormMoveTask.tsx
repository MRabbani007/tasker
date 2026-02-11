"use client";

import ModalForm from "@/components/ui/ModalForm";
import SelectField from "@/components/ui/SelectField";
import { useUser } from "@/context/UserContext";
import { moveTask } from "@/lib/actions/user/tasks";
import { MoveTaskInput, MoveTaskSchema } from "@/lib/schemas/task";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Option = {
  label: string;
  value: string;
};

export default function FormMoveTask({ options }: { options: Option[] }) {
  const { showForm, setShowForm, editItem } = useUser();

  const isOpen = showForm === "MOVE_TASK";

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(MoveTaskSchema),
    defaultValues: { id: "", taskListId: "" },
  });

  // Sync data on Edit
  useEffect(() => {
    if (showForm === "MOVE_TASK" && editItem?.type === "task") {
      reset({
        id: editItem?.data?.id,
        taskListId: editItem?.data?.taskListId ?? "",
      });
    }
  }, [showForm, editItem, reset]);

  const onSubmit: SubmitHandler<MoveTaskInput> = async (data) => {
    if (
      showForm !== "MOVE_TASK" ||
      (editItem?.type === "task" &&
        editItem?.data.taskListId === data.taskListId)
    ) {
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined && val !== null) formData.append(key, String(val));
    });

    try {
      const res = await moveTask(formData);
      if (res.status === 200) {
        toast.success("Task moved");
        setShowForm("");
      } else {
        toast.error("Failed to add task to this collection");
      }
    } catch {
      toast.error("Network synchronization failed");
    }
  };

  return (
    <ModalForm
      title={"Move Task"}
      isOpen={isOpen}
      setShowForm={setShowForm}
      onReset={() => setShowForm("")}
      onSubmit={handleSubmit(onSubmit)}
      loading={isSubmitting}
      type={"edit"}
      maxW="max-w-3xl"
    >
      <SelectField
        options={options}
        label="Collection"
        {...register("taskListId")}
      />
    </ModalForm>
  );
}
