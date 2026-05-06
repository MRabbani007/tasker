"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LayoutGrid, List } from "lucide-react"; // Using lucide-react for icons
import { cn } from "@/lib/utils"; // Common utility for tailwind classes
import ModalForm from "@/components/ui/ModalForm";
import { useUser } from "@/context/UserContext";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  SelectTaskListInput,
  SelectTaskListSchema,
} from "@/lib/schemas/taskList";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserProfile } from "@/lib/actions/user/profile";
import { useTasks } from "@/context/TaskProvider";

export function TaskListSelector() {
  const { showForm, setShowForm, editItem, profile } = useUser();
  const { taskLists } = useTasks();

  const isOpen = showForm === "SELECT_LIST";

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentListId = searchParams.get("taskList");

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(SelectTaskListSchema),
    defaultValues: { taskListId: profile?.taskListId ?? "" },
  });

  const onSubmit: SubmitHandler<SelectTaskListInput> = async (data) => {
    if (showForm !== "SELECT_LIST") {
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined && val !== null) formData.append(key, String(val));
    });

    // formData.append("taskListId", data.taskListId);

    const res = await updateUserProfile(formData);

    if (res.success) {
      setShowForm("");
    }

    const params = new URLSearchParams(searchParams.toString());
    if (data.taskListId) {
      params.set("taskList", data.taskListId);
    } else {
      params.delete("taskList");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <ModalForm
      title={"Select List"}
      isOpen={isOpen}
      setShowForm={setShowForm}
      onReset={() => setShowForm("")}
      onSubmit={handleSubmit(onSubmit)}
      loading={isSubmitting}
      type={"edit"}
      maxW="max-w-3xl"
      footer={null}
    >
      {/* "All Tasks" Pill */}
      <button
        type="submit"
        name="taskListId"
        value={""}
        onClick={() => setValue("taskListId", "")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap",
          !currentListId
            ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
        )}
      >
        <LayoutGrid size={16} />
        All Tasks
      </button>
      {/* Dynamic Lists */}
      {taskLists.map((list) => {
        const isActive = currentListId === list.id;
        return (
          <button
            key={list.id}
            name="taskListId"
            value={list.id}
            type="submit"
            onClick={() => setValue("taskListId", list.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm text-start font-medium rounded-full transition-all whitespace-nowrap",
              isActive
                ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
            )}
          >
            <List size={16} />
            <div>
              <p>{list?.title}</p>
              <p>{list?.subtitle}</p>
              <p>{list?.details}</p>
            </div>
          </button>
        );
      })}
    </ModalForm>
  );
}
