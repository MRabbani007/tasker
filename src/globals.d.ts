import { Note, Task, TaskList } from "../generated/prisma/client";

declare global {
  type RHFError =
    | FieldError
    | Merge<FieldError, FieldErrorsImpl>
    | FieldErrorsImpl
    | undefined;

  type AdminFiltersType = {
    query?: string;
  };

  type Sort = {
    field: "createdAt" | "sortIndex";
    direction: "asc" | "desc";
  };

  export type AdminFormType = "CREATE_LIST" | "CREATE_TASK" | "";

  export type UserFormType =
    | "CREATE_LIST"
    | "CREATE_TASK"
    | "CREATE_NOTE"
    | "EDIT_LIST"
    | "EDIT_TASK"
    | "EDIT_NOTE"
    | "";

  type EditItem<TType extends string, TData> = {
    type: TType;
    data: TData;
  };

  type AdminEditItem =
    | EditItem<"tasklist", TaskList>
    | EditItem<"task", Task>
    | EditItem<"note", Note>
    | EditItem<"empty", { id: string }>
    | null;

  type UserEditItem =
    | EditItem<"tasklist", TaskList>
    | EditItem<"task", Task>
    | EditItem<"note", Note>
    | EditItem<"empty", { id: string }>
    | null;

  type TaskFilters = {
    query?: string;
    completed?: boolean | string;
    priority?: number | string;
    dueOn?: Date | string;
    completedAt?: Date | string;
    taskList?: string;
  };

  type TaskListFilters = {
    query?: string;
  };
}

export {};
