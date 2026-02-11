"use client";

import { Expand } from "@/components/Expand";
import InputField from "@/components/forms/InputField";
import ModalForm from "@/components/ui/ModalForm";
import TextAreaField from "@/components/ui/TextAreaField";
import { useUser } from "@/context/UserContext";
import { useCommandShortcut } from "@/hooks/useCommandShortcut";
import {
  createJournalEntry,
  deleteJournalEntry,
  updateJournalEntry,
} from "@/lib/actions/user/journal";
import {
  formatDateToParam,
  parseDayParam,
  toInputDateValue,
} from "@/lib/format/date";
import {
  CreateJournalEntryInput,
  createJournalEntrySchema,
} from "@/lib/schemas/journal";
import { T_JournalEntry } from "@/lib/templates";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function FormJournalEntry() {
  const { showForm, setShowForm, editItem } = useUser();
  const searchParams = useSearchParams();

  const isOpen =
    showForm === "CREATE_JOURNAL_ENTRY" || showForm === "EDIT_JOURNAL_ENTRY";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(createJournalEntrySchema),
    defaultValues: { ...T_JournalEntry },
  });

  useCommandShortcut({ key: "a", alt: false }, () =>
    setShowForm("CREATE_JOURNAL_ENTRY"),
  );

  // Sync data on Edit
  useEffect(() => {
    if (showForm === "EDIT_JOURNAL_ENTRY" && editItem?.type === "journal") {
      reset({
        ...T_JournalEntry,
        ...editItem.data,
        occurredOn: editItem.data.occurredOn
          ? editItem.data.occurredOn.toISOString().slice(0, 10)
          : undefined,
        occurredAt: editItem.data.occurredAt
          ? editItem.data.occurredAt.toISOString().slice(11, 16)
          : undefined,
      });
    } else if (showForm === "CREATE_JOURNAL_ENTRY") {
      const day = searchParams?.get("day")?.trim();

      reset({
        ...T_JournalEntry,
        occurredOn: toInputDateValue(parseDayParam(day)),
      });
    }
  }, [showForm, editItem, reset, searchParams]);

  const onSubmit: SubmitHandler<CreateJournalEntryInput> = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined && val !== null) formData.append(key, String(val));
    });

    try {
      const action =
        showForm === "CREATE_JOURNAL_ENTRY"
          ? createJournalEntry
          : updateJournalEntry;
      const res = await action(formData);

      if (res.status === 200) {
        toast.success(
          showForm === "CREATE_JOURNAL_ENTRY"
            ? "Entry captured"
            : "Changes synced",
        );
        setShowForm("");
      } else if (res.status === 400) {
        toast.error("Please provide required information");
      } else toast.error("Something went wrong!");
    } catch {
      toast.error("Network synchronization failed");
    }
  };

  const onDelete = async () => {
    if (confirm("Permanently archive this task?")) {
      if (editItem?.type === "journal") {
        await deleteJournalEntry(editItem?.data?.id);
        setShowForm("");
      }
    }
  };

  return (
    <ModalForm
      title={showForm === "CREATE_JOURNAL_ENTRY" ? "Add Entry" : "Update Entry"}
      isOpen={isOpen}
      setShowForm={setShowForm}
      onReset={() => setShowForm("")}
      onSubmit={handleSubmit(onSubmit)}
      loading={isSubmitting}
      type={showForm === "CREATE_JOURNAL_ENTRY" ? "add" : "edit"}
      deleteButton={showForm === "EDIT_JOURNAL_ENTRY"}
      onDelete={onDelete}
      maxW="max-w-3xl"
    >
      <div className="flex flex-col gap-4">
        <Expand show={true}>
          <InputField
            label="Context / Subject"
            placeholder="e.g. Q1 Marketing"
            {...register("subject")}
            error={errors.subject}
          />
        </Expand>
        <TextAreaField
          label="Main Objective"
          placeholder="Describe the core task..."
          {...register("content")}
          error={errors.content}
          autoFocus
        />
        <Expand show={true}>
          <div className="space-y-4">
            <InputField label="Date" type="date" {...register("occurredOn")} />
            <InputField
              label="Specific Time"
              type="time"
              {...register("occurredAt")}
            />
          </div>
        </Expand>
      </div>
    </ModalForm>
  );
}
