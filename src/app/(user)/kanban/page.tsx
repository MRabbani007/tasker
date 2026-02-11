import UserFormTrigger from "@/components/UserFormTrigger";
import KanbanContainer from "@/features/kanban/KanbanContainer";
import FormTask from "@/features/tasks/FormTask";
import { getTasks } from "@/lib/actions/user/tasks";
import { Plus } from "lucide-react";

export default async function KanbanPage() {
  const { data: tasks } = await getTasks({ itemsPerPage: 20 });

  return (
    <main className="flex-1 h-[calc(100vh-64px)] overflow-hidden flex flex-col bg-slate-50/50">
      <header className="p-6 flex items-center justify-between bg-white border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Project Kanban</h1>
        <UserFormTrigger value="CREATE_TASK" type="container">
          <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <Plus size={18} /> New Task
          </button>
        </UserFormTrigger>
      </header>
      <KanbanContainer initialTasks={tasks} />
      <FormTask />
    </main>
  );
}
