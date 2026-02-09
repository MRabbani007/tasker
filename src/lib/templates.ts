import { CreateJournalEntryInput } from "./schemas/journal";
import { TaskInput } from "./schemas/task";
import { TaskListInput } from "./schemas/taskList";

export const T_Task: TaskInput = {
  id: "",
  title: "",
  task: "",
  details: "",
  notes: "",
  priority: 1,
  color: "",
  plannerSortIndex: 0,
  sortIndex: 0,
  status: "",
  taskListId: "",
  dueOn: null,
  dueAt: "",
  link: "",
  linkText: "",
  completed: false,
  completedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

export const T_TaskList: TaskListInput = {
  id: "",
  title: "",
  subtitle: "",
  details: "",
  status: "",
  type: "",
  icon: "",
  sortIndex: 0,
};

export const T_JournalEntry: CreateJournalEntryInput = {
  content: "",
  type: "NOTE",
  occurredAt: "",
  occurredOn: new Date(),
  sortIndex: 0,
  subject: "",
};
