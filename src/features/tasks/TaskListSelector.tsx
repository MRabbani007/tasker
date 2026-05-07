"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Check, LayoutGrid, List, Plus } from "lucide-react"; // Using lucide-react for icons
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
import { IconRenderer } from "@/lib/icons/lucide";

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

  const handleSelect = (id: string) => {
    setValue("taskListId", id);
    handleSubmit(onSubmit)();
  };

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
      <div className="space-y-6 py-2">
        {/* Section: Global View */}
        <div>
          {/* <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3 px-1">
            Global View
          </h4> */}
          <button
            onClick={() => handleSelect("")}
            className={cn(
              "group relative w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200",
              !currentListId
                ? "bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-200"
                : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50",
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                !currentListId
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200",
              )}
            >
              <LayoutGrid size={24} />
            </div>
            <div className="text-left flex-1">
              <p className="font-bold text-slate-900">All Tasks</p>
              <p className="text-xs text-slate-500 font-medium">
                View everything across all your lists
              </p>
            </div>
            {!currentListId && <Check className="text-indigo-600" size={20} />}
          </button>
        </div>

        {/* Section: Your Lists */}
        <div>
          {/* <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3 px-1">
            Your Project Lists
          </h4> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {taskLists.map((list) => {
              const isActive = currentListId === list.id;
              const accentColor = list.color || "#4f46e5";

              return (
                <button
                  key={list.id}
                  onClick={() => handleSelect(list.id)}
                  className={cn(
                    "group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left active:scale-[0.98]",
                    isActive
                      ? "bg-white shadow-sm ring-2 ring-(--list-accent)"
                      : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-md",
                  )}
                  style={
                    {
                      // ring: isActive ? accentColor : 'transparent',
                      "--list-accent": accentColor,
                      borderColor: isActive ? accentColor : undefined,
                    } as React.CSSProperties
                  }
                >
                  {/* Icon Container */}
                  <div
                    className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                    }}
                  >
                    <IconRenderer iconString={list.icon} size={22} />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 leading-tight truncate">
                      {list.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-1 font-medium">
                      {list.subtitle || "No description"}
                    </p>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div
                      className="w-2.5 h-2.5 rounded-full shadow-sm"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setShowForm("CREATE_LIST")} // Or your specific trigger
              className="group flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200 text-left active:scale-[0.98]"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-indigo-300 group-hover:text-indigo-500 transition-colors">
                <Plus size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">
                  Create New List
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Organize your project
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </ModalForm>
  );
}
