import { cn } from "@/lib/utils";

export function NotificationSettings() {
  const settings = [
    {
      id: "task_assigned",
      label: "Task Assigned",
      desc: "When someone assigns a task to you",
    },
    {
      id: "due_date",
      label: "Due Date Reminders",
      desc: "Alerts for tasks that are almost due",
    },
    {
      id: "comments",
      label: "New Comments",
      desc: "When someone replies to your task",
    },
    {
      id: "daily_summary",
      label: "Daily Summary",
      desc: "A morning overview of your planned day",
    },
  ];

  return (
    <div className="flex-1 space-y-8">
      <div>
        <h3 className="text-lg font-bold text-slate-800">
          Notification Preferences
        </h3>
        <p className="text-sm text-slate-500">
          Choose how and when you want to be interrupted.
        </p>
      </div>

      <div className="overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-4 font-semibold text-sm text-slate-400 uppercase tracking-wider">
                Event
              </th>
              <th className="pb-4 font-semibold text-sm text-slate-400 uppercase tracking-wider text-center">
                In-App
              </th>
              <th className="pb-4 font-semibold text-sm text-slate-400 uppercase tracking-wider text-center">
                Email
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {settings.map((item) => (
              <tr key={item.id} className="group">
                <td className="py-5 pr-4">
                  <p className="text-sm font-bold text-slate-700">
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </td>
                <td className="py-5 text-center">
                  <CustomToggle defaultChecked />
                </td>
                <td className="py-5 text-center">
                  <CustomToggle />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <button className="text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors">
          Mute all notifications for 24 hours
        </button>
      </div>
    </div>
  );
}

// Reusable Toggle for the settings table
function CustomToggle({ defaultChecked = false }) {
  return (
    <button
      className={cn(
        "inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ring-2 ring-transparent focus:ring-indigo-500/20",
        defaultChecked ? "bg-indigo-600" : "bg-slate-200",
      )}
    >
      <span
        className={cn(
          "inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
          defaultChecked ? "translate-x-5" : "translate-x-1",
        )}
      />
    </button>
  );
}
